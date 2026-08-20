<a id="readme-top"></a>



<br />
<div align="center">

<h3 align="center">Base UI</h3>

  <p align="center">
    An implementation of GameCrafters' Base UI Design System using React.
  </p>

[![npm][npm-shield]][npm-url]
[![Contributors][contributors-shield]][contributors-url]
[![Last Commit][last-commit-shield]][last-commit-url]
[![MIT License][license-shield]][license-url]

  <p align="center">
    <a href="https://www.npmjs.com/package/@gamecrafters/base-ui">View Package</a>
    &middot;
    <a href="https://github.com/donaldturinglee/base-ui/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/donaldturinglee/base-ui/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



## Getting Started

To use Base UI in an application, install the package and import its stylesheet. To work on the library itself, clone the repository and run Storybook.

### Installation

To use the library in an application:

1. Install the package
   ```sh
   npm install @gamecrafters/base-ui
   ```
2. Import the stylesheet once, at the root of the application
   ```js
   import '@gamecrafters/base-ui/main.css';
   ```

To work on the library itself:

1. Clone the repo
   ```sh
   git clone https://github.com/donaldturinglee/base-ui.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start Storybook, which is where the components are developed and read
   ```sh
   npm run storybook
   ```
4. Install the browsers the end to end suites are driven through, which is only needed once
   ```sh
   npx playwright install chromium
   ```
5. Working from a fork, change the git remote url to avoid accidental pushes to the base project
   ```sh
   git remote set-url origin https://github.com/your_username/base-ui.git
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Usage

Wrap the application in a `ThemeProvider` so the tokens resolve, then reach for the components:

```jsx
import { Box, Button, FormControl, Stack, TextInput, ThemeProvider } from '@gamecrafters/base-ui/react';
import '@gamecrafters/base-ui/main.css';

const App = () => (
  <ThemeProvider colorMode="auto">
    <Box padding="normal" background="muted" border="default" radius="medium">
      <Stack gap="normal">
        <FormControl required>
          <FormControl.Label>Name</FormControl.Label>
          <TextInput block />
          <FormControl.Caption>The name people will know you by</FormControl.Caption>
        </FormControl>
        <Button variant="primary">Save</Button>
      </Stack>
    </Box>
  </ThemeProvider>
);

export default App;
```

`colorMode` takes `day`, `night` or `auto`; `auto` follows the operating system. A nested `ThemeProvider` only has to say what it changes, so a subtree can hold a scheme of its own.

For a right-to-left subtree, wrap it in a `DirectionProvider`:

```jsx
import { DirectionProvider } from '@gamecrafters/base-ui/react';

<DirectionProvider direction="rtl">{children}</DirectionProvider>;
```

The scripts are run from the root and reach the packages through Turbo, which caches a task
against its inputs so an unchanged package is not built or tested twice:

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs the docs and the site, on ports 3001 and 3000 |
| `npm run storybook` | Runs Storybook on port 3001 |
| `npm run storybook:build` | Builds the static Storybook |
| `npm test` | Runs the Vitest suites |
| `npm run test:e2e` | Runs the Playwright suites against Storybook |
| `npm run build` | Builds the package with Rolldown into `packages/react/build/` |
| `npm run lint` | Lints each package's own sources with ESLint |
| `npm run format` | Applies both the ESLint and Prettier fixes |
| `npm run clean` | Removes the build output |

Any one of them can be pointed at a single package instead, with `npm run build --workspace
@gamecrafters/base-ui`.

_Every component has a page in Storybook, with a Playground story for its props and a Features section for what it can do._

### The MCP server

The workspace also holds `@gamecrafters/base-ui-mcp`, a Model Context Protocol server that lets a
coding agent ask the design system what it holds rather than guess at it. Everything it answers is
read out of the library's own sources at the end of a build, so it says what the components were
written as rather than what was once written about them.

```json
{
  "mcpServers": {
    "base-ui": {
      "command": "npx",
      "args": ["-y", "@gamecrafters/base-ui-mcp"]
    }
  }
}
```

| Tool | What it answers |
| --- | --- |
| `get_setup_guide` | What an application does once, before any component is written into it |
| `list_components` | Every component and provider the package exports |
| `get_component` | Every prop one of them takes, with what it is for and the values it takes |
| `get_component_examples` | The same component as it is already written, taken from its stories |
| `list_tokens` | The design tokens to reach for in place of a literal colour or measurement |

Working on the server itself, `npm run build --workspace @gamecrafters/base-ui-mcp` writes it and
its registry to `packages/mcp/build/`, which a client can be pointed straight at with `node`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Roadmap

See the [open issues](https://github.com/donaldturinglee/base-ui/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Run `npm run lint`, `npm test` and `npm run test:e2e`
4. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

A new component follows the shape of the ones already there: a `ComponentName.tsx`, a `ComponentName.types.ts`, an `index.ts`, a Vitest suite and two Storybook files under `packages/react/src/components/<component-name>`, with its stylesheet under `packages/react/src/styles/components` and one line added to each of the two barrels.

A Vitest suite is where a component is held to what it draws and what it says, and it is what
every component carries. A Playwright suite under `e2e` is for the behaviour only a browser can
settle — where focus lands, what the top layer holds, what colour the cascade came out with —
and is added where a component has some.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/donaldturinglee/base-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=donaldturinglee/base-ui" alt="contrib.rocks image" />
</a>



## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

[![LinkedIn](https://go-skill-icons.vercel.app/api/icons?i=linkedin&theme=dark)](https://www.linkedin.com/in/donaldturinglee/) &nbsp;
[![Discord](https://go-skill-icons.vercel.app/api/icons?i=discord&theme=dark)](https://discord.gg/YsteKRjrSH) &nbsp;
[![Twitter](https://go-skill-icons.vercel.app/api/icons?i=x&theme=dark)](https://x.com/donaldturinglee) &nbsp;
[![YouTube](https://go-skill-icons.vercel.app/api/icons?i=youtube&theme=dark)](https://www.youtube.com/channel/UCOHOUOsJjGPBlov7FuwPDbA) &nbsp;

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Acknowledgments

<a href="https://linux.do/">
  <img src="https://i.imgur.com/XuAMvhs.png" alt="LINUX DO" width="64" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



[npm-shield]: https://img.shields.io/npm/v/%40gamecrafters%2Fbase-ui.svg?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@gamecrafters/base-ui
[contributors-shield]: https://img.shields.io/github/contributors/donaldturinglee/base-ui.svg?style=for-the-badge
[contributors-url]: https://github.com/donaldturinglee/base-ui/graphs/contributors
[last-commit-shield]: https://img.shields.io/github/last-commit/donaldturinglee/base-ui.svg?style=for-the-badge
[last-commit-url]: https://github.com/donaldturinglee/base-ui/commits/main
[license-shield]: https://img.shields.io/github/license/donaldturinglee/base-ui.svg?style=for-the-badge
[license-url]: https://github.com/donaldturinglee/base-ui/blob/main/LICENSE
