# SSV Scanner

![GitHub](https://img.shields.io/github/license/ssvlabs/ssv-scanner)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ssvlabs/ssv-scanner)

![GitHub commit activity](https://img.shields.io/github/commit-activity/y/ssvlabs/ssv-scanner)
![GitHub contributors](https://img.shields.io/github/contributors/ssvlabs/ssv-scanner)
![GitHub last commit](https://img.shields.io/github/last-commit/ssvlabs/ssv-scanner)

![GitHub package.json dynamic](https://img.shields.io/github/package-json/keywords/ssvlabs/ssv-scanner)

![Discord](https://img.shields.io/discord/723834989506068561?style=for-the-badge&label=Ask%20for%20support&logo=discord&logoColor=white)

---

This repository contains The ssv scanner library and CLI.
It is used to retrieve events data from the SSV [network contract](https://docs.ssv.network/developers/smart-contracts/ssvnetwork).
The tool is used for retrieving the latest cluster snapshot or owner nonce from the blockchain, which are required as inputs for SSV tooling and smart contract transactions.

## Running from the CLI

### Installation

This installation requires NodeJS on your machine.
You can download it [here](https://nodejs.org/en/download/).

Once you have installed NodeJS, follow these instructions to prepare the project:

```bash
git clone https://github.com/ssvlabs/ssv-scanner.git
cd ssv-scanner
npm install
npm run cli -- --help
```

Optional (recommended to avoid subgraph rate limits):

```bash
export SSV_SUBGRAPH_API_KEY=your_the_graph_api_key_here
```

### Running as a CLI from the repository


#### Help

Help on available actions:

```bash
npm run cli -- --help
```

#### Example cluster scanner

**Input parameters:**

- node-url (n) = The ETH1 node url
- network (nw) = The network (mainnet, hoodi)
- owner-address (oa) = Cluster owner address
- operator-ids (oids) = Comma separated operator ids list

Example of running cluster scanner in the CLI:
```bash
npm run cli -- cluster -n .... -nw mainnet -oa ..... -oids 1,2,3,4
```

**Output:**  Latest cluster data (serialized).

#### Example nonce scanner

**Input parameters:**

- node-url (n) = The ETH1 node url
- network (nw) = The network (mainnet, hoodi)
- owner-address (oa) = Cluster owner address


Example of running nonce scanner in the CLI:
```bash
npm run cli -- nonce -n https://the_eth_node -nw network -oa 0xeth_address
```

**Output:**  Current owner nonce.

### Example operator scanner

**Input parameters:**

- node-url (n) = The ETH1 node url
- network (nw) = The network (mainnet, hoodi)
- owner-address (oa) = Owner address
- output-path (o) = A full output path (not mandatory, default output path is .../ssv-scanner/dist/tsc/src/data/)

Example of running cluster scanner in the CLI:
```bash
npm run cli -- operator -n https://the_eth_node -nw network -oa 0xeth_address
```
**Output:**  File output path (json with operator pubkeys associated with the owner clusters)


## Integration in your projects

### Node Project

To run an example of a NodeJS project containing all the code snippets to build the share and transaction payload, simply follow these instructions!

```bash
cd examples
npm install
```

To run a JavaScript example:

```bash
npm run start:js
```

To run a Typescript example:

```bash
npm run start
```

## Development

### Run the CLI as a TypeScript executable:

```bash
npm run dev:cli -- ...
```

### Run the CLI as a JavaScript compiled executable:

```bash
npm run cli -- ...
```

### Lint

```bash
npm run lint
```

### Building

Build TypeScript into JavaScript

```bash
npm run build
```

Build for NodeJs using `esbuild`

```bash
npm run esbuild
```

Build everything

```bash
npm run build-all
```

## TODO

## License

The ssv-api is licensed under the
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html),
also included in our repository in the `LICENSE` file.
