# Prompt my Docs

> Ask questions about any data using GPT. 

Have you ever found a new library and wanted to ask questions about it? Then look no further, as you can put any data inside of [docs](/docs) and start prompting. 

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

---

<!-- toc -->

- [In Action](#in-action)
- [Setup](#setup)
- [Bring your docs](#bring-your-docs)
- [Start prompt-my-docs](#start-prompt-my-docs)
- [Under the hood](#under-the-hood)
- [Config](#config)
  * [Disabling a File Type](#disabling-a-file-type)
  * [Changing ignorePaths](#changing-ignorepaths)
  * [Changing maxDocs and chunkSize](#changing-maxdocs-and-chunksize)
  * [Changing `docSearchDistance` to make the search more strict](#changing-docsearchdistance-to-make-the-search-more-strict)
  * [Changing `docSearchDistance` to find more docs](#changing-docsearchdistance-to-find-more-docs)
- [Do I have to use Next.js?](#do-i-have-to-use-nextjs)

<!-- tocstop -->

---

## In Action

![Prompt my Docs using hyv](/public/prompt_my_docs_get_started_with_hyv.png)



## Setup

* [Clone the project](https://github.com/failfa-st/prompt-my-docs) or [download the ZIP](https://github.com/failfa-st/prompt-my-docs/archive/refs/heads/main.zip)
* Install dependencies: `npm i`
* Register for a [Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance) and obtain the host of your sandbox and the API Key
* Create an OpenAI account and create an [API Key](https://platform.openai.com/account/api-keys)
* Create a `.env` based on `.env.example` and put the API keys (both Weaviate & OpenAI) + Weaviate host inside
  
## Bring your docs

Add all the files that you want to search into the [docs](/docs) folder (currently only all `fileTypes` (like `js`, `ts` or `md`) that are defined in the [config](#config), please open an issue for more!)

For example you can clone a repo that you would love to learn about into the [docs](/docs) folder, like [hyv](https://github.com/failfa-st/hyv). 

When you have prepared your data, you can add it into the vector database:

```shell
# Populate the database. This only needs to be done once for a new database.
# Run this if new pages have been added or content has been changed.
npm run update-database
```

## Start prompt-my-docs

When the vector database is ready, you can start the web app:

```shell
# Run the development server.
npm run dev
```

Open the web app via [localhost:3000](http://localhost:3000) (or similar based on your setup). 

## Under the hood

* We read all your data from the "docs" folder, currently only all `fileTypes` (like `js`, `ts` or `md`) that are defined in the [config](#config)
* Your data will be converted into a vector and saved into the vector database (e.g. weaviate)
  * This needs to be done before you run the project for the first time or when your data is changing
* You can then run the project and open the web app
* You can then ask your question and we will use the data from the vector database that is very similar to your prompt to populate the context when we interact with GPT
  * This makes sure that GPT knows about your specific data and can answer questions related to your data


## Config

The default config looks like this:

```json
{
  "fileTypes": {
    "markdown": {
      "enabled": true,
      "extensions": [".md", ".mdx"],
      "ignorePaths": ["node_modules", "dist", ".github"],
      "chunkSize": 1000,
      "chunkOverlap": 0
    },
    "js": {
      "enabled": true,
      "extensions": [".js", ".jsx"],
      "ignorePaths": ["node_modules", "dist", ".github"],
      "chunkSize": 1000,
      "chunkOverlap": 0
    },
    "ts": {
      "enabled": true,
      "extensions": [".ts", ".tsx"],
      "ignorePaths": ["node_modules", "dist", ".github", ".d.ts"],
      "chunkSize": 1000,
      "chunkOverlap": 0
    }
  },
  "vectorDatabase": {
    "maxDocs": 7,
    "docSearchDistance": 0.24,
    "answerSearchDistance": 0.24
  }
}
```


You can override the default configuration by creating a `config.json` file in the root of the project.

### Disabling a File Type

This configuration disables the markdown file type.

```json
{
  "fileTypes": {
    "markdown": {
      "enabled": false
    }
  }
}
```

### Changing ignorePaths

This configuration changes the ignore paths for markdown files, removing `dist` and `.github` from the ignore list and adding `src`.

```json
{
  "fileTypes": {
    "markdown": {
      "ignorePaths": ["node_modules", "src"]
    }
  }
}
```

### Changing maxDocs and chunkSize

This configuration reduces the maximum number of documents retrieved from the vector database to `4` and increases the `chunkSize` for markdown files to `1500`. After changing the configuration, run `npm run update-database` to update the database.

```json
{
  "vectorDatabase": {
    "maxDocs": 4
  },
  "fileTypes": {
    "markdown": {
      "chunkSize": 1500
    }
  }
}
```

### Changing `docSearchDistance` to make the search more strict

This configuration reduces the `docSearchDistance` to `0.1`, making searching documents in the vector database more strict. This means that returned documents will be more closely related to the search vector prompt.

```json
{
  "vectorDatabase": {
    "docSearchDistance": 0.1
  }
}
```


### Changing `docSearchDistance` to find more docs

This configuration increases the `docSearchDistance` to `0.3`. This change makes the search for documents in the vector database less strict. As a result, more documents are found, but they may be less closely related to the search vector prompt.

```json
{
  "vectorDatabase": {
    "docSearchDistance": 0.3
  }
}
```


## Do I have to use Next.js?

You don't need Next.js to use the prompt-my-docs, we just use it, as it's a nice way to have a web app running. You can also just extract the parts that you need and use them without Next.js on your website. We just hadn't the requirement yet. But if you need help here, please open an issue and we are happy to extract the parts that are needed, so you can use them in any environment. 

We are using an [API route from Next.js](/src/pages/api/ama.ts), so that the request to GPT happens on the server and we don't have to expose the secrets to the client. But you could write your own API and use everything else without Next.js at all.
