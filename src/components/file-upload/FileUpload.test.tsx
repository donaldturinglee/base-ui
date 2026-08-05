import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { FileUpload } from ".";
import { formatFileSize, isFileAccepted, triageFiles } from "./files";

const makeFile = (name: string, type = "text/plain", size = 8) => {
    const file = new File(["a".repeat(size)], name, { type });
    // jsdom works the size out from the parts it was given, but a story about a file that is
    // too large should not have to build a file that large
    Object.defineProperty(file, "size", { value: size });
    return file;
};

const control = () => screen.getByTestId("file-upload").querySelector("input") as HTMLInputElement;

const zone = () => screen.getByTestId("file-upload").querySelector("label") as HTMLLabelElement;

const pick = (files: File[]) => {
    fireEvent.change(control(), { target: { files } });
};

const drop = (files: File[]) => {
    fireEvent.drop(zone(), { dataTransfer: { files, types: ["Files"] } });
};

describe("FileUpload", () => {
    it("renders a file input tagged as a FileUpload", () => {
        render(<FileUpload data-testid="file-upload" />);

        expect(screen.getByTestId("file-upload")).toHaveAttribute("data-component", "FileUpload");
        expect(control()).toHaveAttribute("type", "file");
        expect(control()).toHaveAttribute("data-component", "FileUpload.Input");
    });

    it("hands the control what it takes and how it is posted", () => {
        render(
            <FileUpload
                data-testid="file-upload"
                name="attachment"
                accept=".pdf,image/*"
                multiple
                required
            />,
        );

        expect(control()).toHaveAttribute("name", "attachment");
        expect(control()).toHaveAttribute("accept", ".pdf,image/*");
        expect(control()).toBeRequired();
        expect(control()).toHaveAttribute("multiple");
    });

    it("stands at the medium step of the control scale by default", () => {
        render(<FileUpload data-testid="file-upload" />);

        expect(screen.getByTestId("file-upload")).toHaveAttribute("data-size", "medium");
    });

    it("stands at whichever step of the scale it is given", () => {
        render(<FileUpload data-testid="file-upload" size="large" />);

        expect(screen.getByTestId("file-upload")).toHaveAttribute("data-size", "large");
    });

    it("names the control after its label", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.Label>Drop files here</FileUpload.Label>
            </FileUpload>,
        );

        expect(screen.getByLabelText("Drop files here")).toBe(control());
    });

    it("keeps the name the caller gave the control", () => {
        render(
            <FileUpload data-testid="file-upload" aria-label="Attachments">
                <FileUpload.Label>Drop files here</FileUpload.Label>
            </FileUpload>,
        );

        expect(control()).toHaveAccessibleName("Attachments");
    });

    it("describes the control with the line below its label", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.Label>Drop files here</FileUpload.Label>
                <FileUpload.Description>Up to 25 MB</FileUpload.Description>
            </FileUpload>,
        );

        expect(control()).toHaveAccessibleDescription("Up to 25 MB");
    });

    it("renders the icon, the label and the description inside the zone", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.Icon />
                <FileUpload.Label>Drop files here</FileUpload.Label>
                <FileUpload.Description>Up to 25 MB</FileUpload.Description>
            </FileUpload>,
        );

        expect(zone()).toContainElement(screen.getByText("Drop files here"));
        expect(zone()).toContainElement(screen.getByText("Up to 25 MB"));
    });

    it("renders the list of files outside the zone, so pressing it does not open the picker", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.Label>Drop files here</FileUpload.Label>
                <FileUpload.List>
                    <FileUpload.Item name="notes.txt" />
                </FileUpload.List>
            </FileUpload>,
        );

        const list = screen.getByRole("list");
        expect(screen.getByTestId("file-upload")).toContainElement(list);
        expect(zone()).not.toContainElement(list);
    });

    it("reads as invalid where it is drawn as invalid", () => {
        render(<FileUpload data-testid="file-upload" validationStatus="error" />);

        expect(screen.getByTestId("file-upload")).toHaveAttribute("data-validation", "error");
        expect(control()).toBeInvalid();
    });

    describe("choosing files", () => {
        it("hands over what was picked", () => {
            const onSelect = jest.fn();
            render(<FileUpload data-testid="file-upload" multiple onSelect={onSelect} />);

            const files = [makeFile("one.txt"), makeFile("two.txt")];
            pick(files);

            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(files, "input");
        });

        it("hands over what was dropped", () => {
            const onSelect = jest.fn();
            render(<FileUpload data-testid="file-upload" multiple onSelect={onSelect} />);

            const files = [makeFile("one.txt")];
            drop(files);

            expect(onSelect).toHaveBeenCalledWith(files, "drop");
        });

        it("turns away a file that is not one of the types it takes", () => {
            const onSelect = jest.fn();
            const onReject = jest.fn();
            render(
                <FileUpload
                    data-testid="file-upload"
                    accept="image/*"
                    onSelect={onSelect}
                    onReject={onReject}
                />,
            );

            const file = makeFile("notes.txt");
            pick([file]);

            expect(onSelect).not.toHaveBeenCalled();
            expect(onReject).toHaveBeenCalledWith([{ file, reason: "type" }], "input");
        });

        it("turns away a file that weighs more than it allows", () => {
            const onSelect = jest.fn();
            const onReject = jest.fn();
            render(
                <FileUpload
                    data-testid="file-upload"
                    maxSize={16}
                    onSelect={onSelect}
                    onReject={onReject}
                />,
            );

            const small = makeFile("small.txt", "text/plain", 8);
            const large = makeFile("large.txt", "text/plain", 32);
            pick([small, large]);

            expect(onSelect).toHaveBeenCalledWith([small], "input");
            expect(onReject).toHaveBeenCalledWith([{ file: large, reason: "size" }], "input");
        });

        it("keeps the first file where it only takes one at a time", () => {
            const onSelect = jest.fn();
            const onReject = jest.fn();
            render(
                <FileUpload data-testid="file-upload" onSelect={onSelect} onReject={onReject} />,
            );

            const first = makeFile("one.txt");
            const second = makeFile("two.txt");
            pick([first, second]);

            expect(onSelect).toHaveBeenCalledWith([first], "input");
            expect(onReject).toHaveBeenCalledWith([{ file: second, reason: "count" }], "input");
        });

        it("says nothing where nothing was taken", () => {
            const onSelect = jest.fn();
            render(<FileUpload data-testid="file-upload" accept="image/*" onSelect={onSelect} />);

            pick([makeFile("notes.txt")]);

            expect(onSelect).not.toHaveBeenCalled();
        });
    });

    describe("dragging over the zone", () => {
        it("answers a file held over it", () => {
            render(<FileUpload data-testid="file-upload" />);

            fireEvent.dragEnter(zone());

            expect(screen.getByTestId("file-upload")).toHaveAttribute("data-dragging", "true");
        });

        it("lets go once as much has left the zone as arrived", () => {
            render(<FileUpload data-testid="file-upload" />);

            fireEvent.dragEnter(zone());
            fireEvent.dragEnter(zone());
            fireEvent.dragLeave(zone());

            expect(screen.getByTestId("file-upload")).toHaveAttribute("data-dragging", "true");

            fireEvent.dragLeave(zone());

            expect(screen.getByTestId("file-upload")).not.toHaveAttribute("data-dragging");
        });

        it("lets go once the files have been dropped", () => {
            render(<FileUpload data-testid="file-upload" />);

            fireEvent.dragEnter(zone());
            drop([makeFile("one.txt")]);

            expect(screen.getByTestId("file-upload")).not.toHaveAttribute("data-dragging");
        });
    });

    describe("disabled", () => {
        it("stops the control being used", () => {
            render(<FileUpload data-testid="file-upload" disabled />);

            expect(control()).toBeDisabled();
            expect(screen.getByTestId("file-upload")).toHaveAttribute("data-disabled", "true");
        });

        it("takes nothing that is dropped on it", () => {
            const onSelect = jest.fn();
            render(<FileUpload data-testid="file-upload" disabled onSelect={onSelect} />);

            fireEvent.dragEnter(zone());
            drop([makeFile("one.txt")]);

            expect(onSelect).not.toHaveBeenCalled();
            expect(screen.getByTestId("file-upload")).not.toHaveAttribute("data-dragging");
        });
    });
});

describe("FileUpload.List", () => {
    it("renders nothing where there is nothing in it", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.List />
            </FileUpload>,
        );

        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("is read as a list even though it is drawn without its markers", () => {
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.List>
                    <FileUpload.Item name="notes.txt" />
                </FileUpload.List>
            </FileUpload>,
        );

        expect(screen.getByRole("list")).toHaveAttribute("data-component", "FileUpload.List");
        expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
});

describe("FileUpload.Item", () => {
    const renderItem = (item: React.ReactNode) =>
        render(
            <FileUpload data-testid="file-upload">
                <FileUpload.List>{item}</FileUpload.List>
            </FileUpload>,
        );

    it("says what the file is called and what it weighs", () => {
        renderItem(<FileUpload.Item name="notes.txt" fileSize={2048} />);

        expect(screen.getByText("notes.txt")).toBeInTheDocument();
        expect(screen.getByText("2 KB")).toBeInTheDocument();
    });

    it("leaves the size out where it was not given one", () => {
        renderItem(<FileUpload.Item name="notes.txt" />);

        expect(screen.getByRole("listitem")).toHaveAttribute("data-status", "pending");
        expect(screen.queryByText(/bytes|KB/)).not.toBeInTheDocument();
    });

    it("draws how far a file on its way has got", () => {
        renderItem(<FileUpload.Item name="clip.mp4" status="uploading" progress={40} />);

        const bar = screen.getByRole("progressbar");
        expect(bar).toHaveAttribute("aria-valuenow", "40");
        expect(bar).toHaveAccessibleName("Uploading clip.mp4");
    });

    it("draws no bar for a file that is not on its way", () => {
        renderItem(<FileUpload.Item name="notes.txt" status="success" progress={100} />);

        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("says what went wrong", () => {
        renderItem(
            <FileUpload.Item name="notes.txt" status="error" description="The upload timed out" />,
        );

        expect(screen.getByRole("listitem")).toHaveAttribute("data-status", "error");
        expect(screen.getByText("The upload timed out")).toBeInTheDocument();
    });

    it("takes the file back out", () => {
        const onRemove = jest.fn();
        renderItem(<FileUpload.Item name="notes.txt" onRemove={onRemove} />);

        fireEvent.click(screen.getByRole("button", { name: "Remove notes.txt" }));

        expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it("names the button that takes the file out however it is asked to", () => {
        renderItem(<FileUpload.Item name="notes.txt" onRemove={() => {}} removeLabel="Discard" />);

        expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    });

    it("draws no button where there is nothing to take the file out", () => {
        renderItem(<FileUpload.Item name="notes.txt" />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});

describe("formatFileSize", () => {
    it("counts bytes whole", () => {
        expect(formatFileSize(0)).toBe("0 bytes");
        expect(formatFileSize(1)).toBe("1 bytes");
        expect(formatFileSize(1023)).toBe("1023 bytes");
    });

    it("carries a size up the scale until it fits", () => {
        expect(formatFileSize(1024)).toBe("1 KB");
        expect(formatFileSize(1536)).toBe("1.5 KB");
        expect(formatFileSize(1024 * 1024)).toBe("1 MB");
        expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
    });

    it("says nothing of a size it cannot read", () => {
        expect(formatFileSize(Number.NaN)).toBe("0 bytes");
        expect(formatFileSize(-1)).toBe("0 bytes");
    });
});

describe("isFileAccepted", () => {
    const png = makeFile("photo.png", "image/png");

    it("takes everything where no types were named", () => {
        expect(isFileAccepted(png)).toBe(true);
        expect(isFileAccepted(png, "  ")).toBe(true);
    });

    it("matches a suffix against the name", () => {
        expect(isFileAccepted(png, ".png")).toBe(true);
        expect(isFileAccepted(png, ".PNG")).toBe(true);
        expect(isFileAccepted(png, ".pdf")).toBe(false);
    });

    it("matches a whole type", () => {
        expect(isFileAccepted(png, "image/*")).toBe(true);
        expect(isFileAccepted(png, "video/*")).toBe(false);
    });

    it("matches a type and a subtype", () => {
        expect(isFileAccepted(png, "image/png")).toBe(true);
        expect(isFileAccepted(png, "image/jpeg")).toBe(false);
    });

    it("takes a file matching any of the types named", () => {
        expect(isFileAccepted(png, ".pdf, image/png")).toBe(true);
    });
});

describe("triageFiles", () => {
    it("sorts what it was given into what is taken and what is turned away", () => {
        const png = makeFile("photo.png", "image/png", 8);
        const text = makeFile("notes.txt", "text/plain", 8);
        const large = makeFile("poster.png", "image/png", 64);

        const { accepted, rejected } = triageFiles([png, text, large], {
            accept: "image/*",
            maxSize: 16,
            multiple: true,
        });

        expect(accepted).toEqual([png]);
        expect(rejected).toEqual([
            { file: text, reason: "type" },
            { file: large, reason: "size" },
        ]);
    });
});
