# Prompt my Docs

> Ask questions the docs using GPT. 

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
  * [Change the config](#change-the-config)
  * [Disabling a file type like `markdown`](#disabling-a-file-type-like-markdown)
  * [Update `ignorePaths` to remove / add paths](#update-ignorepaths-to-remove--add-paths)
  * [Handle larger documents with `maxDocs` and `chunkSize`](#handle-larger-documents-with-maxdocs-and-chunksize)
  * [Changing `docSearchDistance` to make the search more strict](#changing-docsearchdistance-to-make-the-search-more-strict)
  * [Changing `docSearchDistance` to find more docs](#changing-docsearchdistance-to-find-more-docs)
  * [More or less variations in the output with `temperature`](#more-or-less-variations-in-the-output-with-temperature)
  * [Control the length of the generated output with `maxNewTokens`](#control-the-length-of-the-generated-output-with-maxnewtokens)
- [Do I have to use Next.js?](#do-i-have-to-use-nextjs)

<!-- tocstop -->

---

## In Action

We cloned [hyv](https://github.com/failfa-st/hyv) into the [docs](/docs) folder and used the following prompt to generate a guide on how to get started with [hyv](https://github.com/failfa-st/hyv):

 `Getting started guide for hyv with a config for GPT-4, so that I can use GPT-4 to get the answer to my question “what is the meaning of life” and see the result printed to the console. Please use ESM syntax.` 

![Prompt my Docs using hyv](/public/prompt_my_docs_get_started_with_hyv.png)



## Setup

* [Clone the project](https://github.com/failfa-st/prompt-my-docs) or [download the ZIP](https://github.com/failfa-st/prompt-my-docs/archive/refs/heads/main.zip)
* Install dependencies: `npm i`
* Register for a [Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance) and obtain the host of your sandbox and the API Key
* Create an OpenAI account and create an [API Key](https://platform.openai.com/account/api-keys)
  * 🚨 It is recommended to have access to GPT-4, as this is what we used during development of **Prompt my Docs**. If you don't have access yet, see [How can I access GPT-4](https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4)
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
	"vectorDatabase": {
		"maxDocs": 6,
		"docSearchDistance": 0.24,
		"answerSearchDistance": 0.24
	},
	"gpt": {
		"temperature": 0.5,
		"maxNewTokens": 3048
	},
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
			"extensions": [".js"],
			"ignorePaths": ["node_modules", "dist", ".github"],
			"chunkSize": 1000,
			"chunkOverlap": 0
		},
		"ts": {
			"enabled": true,
			"extensions": [".ts"],
			"ignorePaths": ["node_modules", "dist", ".github", ".d.ts"],
			"chunkSize": 1000,
			"chunkOverlap": 0
		}
	}
}

```

### Change the config

You can override the default configuration by creating a `config.json` file at the root of the project. This comes in handy if the default settings make no sense for the docs that you want to use. For example, it might be, that the code files are large, so it's better to have bigger chunks and fewer files. 

We have covered some of the default cases, so feel free to change the config accordingly to your use case. 

### Disabling a file type like `markdown`

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

### Update `ignorePaths` to remove / add paths

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

### Handle larger documents with `maxDocs` and `chunkSize`

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

### More or less variations in the output with `temperature`

The temperature parameter controls the randomness of the GPT's output. A higher temperature value results in more random outputs, while a lower temperature value makes the outputs more deterministic and focused. You might want to adjust this parameter to fine-tune the balance between randomness and determinism in the GPT's responses.

```json
{
  "gpt": {
    "temperature": 0.6
  }
}
```

### Control the length of the generated output with `maxNewTokens`

The `maxNewTokens` parameter controls the maximum length of the output from GPT. By adjusting this value, you can control how much text the GPT generates in response to an input. If you're finding that the responses are too short or too long, you can tweak this setting. 

The context of GPT is defined by combining the tokens of the input (like the user prompt) with the tokens needed to respond (in this case controlled by `maxNewTokens`). For GPT-4 8k, the sum of both values can't exceed 8096 tokens. You will run into an error if you request a bigger context size. 

```json
{
  "gpt": {
    "maxNewTokens": 1024
  }
}
```

## Do I have to use Next.js?

You don't need Next.js to use the prompt-my-docs, we just use it, as it's a nice way to have a web app running. You can also just extract the parts that you need and use them without Next.js on your website. We just hadn't the requirement yet. But if you need help here, please open an issue and we are happy to extract the parts that are needed, so you can use them in any environment. 

We are using an [API route from Next.js](/src/pages/api/ama.ts), so that the request to GPT happens on the server and we don't have to expose the secrets to the client. But you could write your own API and use everything else without Next.js at all.
