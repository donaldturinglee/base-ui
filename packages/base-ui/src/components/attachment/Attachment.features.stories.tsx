import type { StoryFn } from "@storybook/react-vite";
import {
    ArrowDownloadRegular,
    AttachRegular,
    DismissRegular,
    DocumentPdfRegular,
    ErrorCircleRegular,
    ImageRegular,
} from "@gamecrafters/base-ui-icons";
import { ProgressCircle } from "../progress-circle";
import { Attachment } from ".";
import type { AttachmentSize, AttachmentState } from "./Attachment.types";

const classes = {
    list: "flex flex-col items-start gap-[var(--stack-gap-condensed)] m-0 p-0 list-none",
    row: "flex flex-wrap items-start gap-[var(--stack-gap-condensed)]",
};

// How far a file that is still on its way has got. A ring reads a percentage rather than turning
// on the spot, so the stories give it one to draw
const uploadProgress = 45;

const files = [
    { name: "quarterly-report.pdf", state: "done", icon: DocumentPdfRegular },
    { name: "diagram.png", state: "uploading", icon: ImageRegular },
    { name: "notes.pdf", state: "error", icon: ErrorCircleRegular },
    { name: "budget.pdf", state: "done", icon: DocumentPdfRegular },
] as const satisfies readonly { name: string; state: AttachmentState; icon: unknown }[];

export default {
    title: "Components/Attachment/Features",
};

// States
export const States: StoryFn<typeof Attachment> = () => (
    <ul className={classes.list}>
        {(["idle", "uploading", "processing", "error", "done"] as const).map((state) => (
            <li key={state}>
                <Attachment state={state}>
                    <Attachment.Media>
                        {state === "uploading" || state === "processing" ? (
                            <ProgressCircle
                                progress={uploadProgress}
                                size="small"
                                aria-label="Upload quarterly-report.pdf"
                            />
                        ) : state === "error" ? (
                            <ErrorCircleRegular />
                        ) : (
                            <DocumentPdfRegular />
                        )}
                    </Attachment.Media>
                    <Attachment.Content>
                        <Attachment.Title>quarterly-report.pdf</Attachment.Title>
                        <Attachment.Description>
                            {state === "error" ? "Upload failed" : `state="${state}"`}
                        </Attachment.Description>
                    </Attachment.Content>
                </Attachment>
            </li>
        ))}
    </ul>
);

// Size Scale
export const SizeScale: StoryFn<typeof Attachment> = () => (
    <ul className={classes.list}>
        {(["small", "medium", "large"] as const satisfies readonly AttachmentSize[]).map((size) => (
            <li key={size}>
                <Attachment size={size}>
                    <Attachment.Media>
                        <DocumentPdfRegular />
                    </Attachment.Media>
                    <Attachment.Content>
                        <Attachment.Title>{`size="${size}"`}</Attachment.Title>
                        <Attachment.Description>1.2 MB</Attachment.Description>
                    </Attachment.Content>
                </Attachment>
            </li>
        ))}
    </ul>
);

// Vertical
export const Vertical: StoryFn<typeof Attachment> = () => (
    <div className={classes.row}>
        <Attachment orientation="vertical">
            <Attachment.Media>
                <DocumentPdfRegular />
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>notes.pdf</Attachment.Title>
                <Attachment.Description>820 KB</Attachment.Description>
            </Attachment.Content>
        </Attachment>
        <Attachment orientation="vertical">
            <Attachment.Media variant="image">
                <img src="https://github.com/octocat.png" alt="" />
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>octocat.png</Attachment.Title>
                <Attachment.Description>48 KB</Attachment.Description>
            </Attachment.Content>
        </Attachment>
    </div>
);

// With A Thumbnail
export const WithThumbnail: StoryFn<typeof Attachment> = () => (
    <Attachment>
        <Attachment.Media variant="image">
            <img src="https://github.com/octocat.png" alt="" />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>octocat.png</Attachment.Title>
            <Attachment.Description>1024 × 1024</Attachment.Description>
        </Attachment.Content>
    </Attachment>
);

// Media Only
export const MediaOnly: StoryFn<typeof Attachment> = () => (
    <div className={classes.row}>
        <Attachment orientation="vertical">
            <Attachment.Media variant="image">
                <img src="https://github.com/octocat.png" alt="octocat.png" />
            </Attachment.Media>
        </Attachment>
        <Attachment orientation="vertical" state="idle">
            <Attachment.Media>
                <AttachRegular />
            </Attachment.Media>
        </Attachment>
    </div>
);

// With Actions
export const WithActions: StoryFn<typeof Attachment> = () => (
    <Attachment>
        <Attachment.Media>
            <DocumentPdfRegular />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>quarterly-report.pdf</Attachment.Title>
            <Attachment.Description>1.2 MB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
            <Attachment.Action
                icon={ArrowDownloadRegular}
                aria-label="Download quarterly-report.pdf"
            />
            <Attachment.Action icon={DismissRegular} aria-label="Remove quarterly-report.pdf" />
        </Attachment.Actions>
    </Attachment>
);

// With A Trigger
export const WithTrigger: StoryFn<typeof Attachment> = () => (
    <Attachment>
        <Attachment.Media variant="image">
            <img src="https://github.com/octocat.png" alt="" />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>octocat.png</Attachment.Title>
            <Attachment.Description>48 KB</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
            <Attachment.Action icon={DismissRegular} aria-label="Remove octocat.png" />
        </Attachment.Actions>
        {/* The trigger names the attachment for a reader, since the words it is laid over are
            already there to be seen */}
        <Attachment.Trigger as="a" href="https://github.com/octocat.png">
            <span className="sr-only">Open octocat.png</span>
        </Attachment.Trigger>
    </Attachment>
);

// In A Group
export const InAGroup: StoryFn<typeof Attachment> = () => (
    <Attachment.Group aria-label="Attachments">
        {files.map(({ name, state, icon: Icon }) => (
            <Attachment key={name} state={state} size="small">
                <Attachment.Media>
                    {state === "uploading" || state === "processing" ? (
                        <ProgressCircle
                            progress={uploadProgress}
                            size="small"
                            aria-label={`Upload ${name}`}
                        />
                    ) : (
                        <Icon />
                    )}
                </Attachment.Media>
                <Attachment.Content>
                    <Attachment.Title>{name}</Attachment.Title>
                    <Attachment.Description>
                        {state === "error" ? "Upload failed" : "1.2 MB"}
                    </Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                    <Attachment.Action icon={DismissRegular} aria-label={`Remove ${name}`} />
                </Attachment.Actions>
            </Attachment>
        ))}
    </Attachment.Group>
);

// In A List
export const InAList: StoryFn<typeof Attachment> = () => (
    <ul className={classes.list} aria-label="Attachments">
        {["quarterly-report.pdf", "budget.pdf", "notes.pdf"].map((name) => (
            <Attachment key={name} as="li" size="small">
                <Attachment.Media>
                    <DocumentPdfRegular />
                </Attachment.Media>
                <Attachment.Content>
                    <Attachment.Title>{name}</Attachment.Title>
                    <Attachment.Description>1.2 MB</Attachment.Description>
                </Attachment.Content>
                <Attachment.Actions>
                    <Attachment.Action icon={DismissRegular} aria-label={`Remove ${name}`} />
                </Attachment.Actions>
            </Attachment>
        ))}
    </ul>
);
