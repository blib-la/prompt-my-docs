# prompt my docs

> Ask questions about any data using GPT. 

Have you ever found a new library and wanted to ask questions about it? Then look no further, as you can put anything inside of [docs](/docs), add the data into a vector database and start prompting in a web app.

## Setup

* Clone the project or download the ZIP
* Install dependencies: `npm i`
* Register for a [Weaviate sandbox](https://weaviate.io/developers/weaviate/quickstart#create-a-weaviate-instance) and obtain the host of your sandbox and the API Key
* Create an OpenAI account and create an [API Key](https://platform.openai.com/account/api-keys)
* Create a `.env` based on `.env.example` and put the API keys (both Weaviate & OpenAI) + Weaviate host inside
  
## Bring your docs

Add all the files that you want to search into the [docs](/docs) folder (currently supported are: ts, md and mdx, please open an issue for more!)

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

* We read all your data from the "docs" folder, currently only ts, md, and mdx
* Your data will be converted into a vector and saved into the vector database (e.g. weaviate)
  * This needs to be done before you run the project for the first time or when your data is changing
* You can then run the project and open the web app
* You can then ask your question and we will use the data from the vector database that is very similar to your prompt to populate the context when we interact with GPT
  * This makes sure that GPT knows about your specific data and can answer questions related to your data


## Do I have to use Next.js?

You don't need Next.js to use the prompt-my-docs, we just use it, as it's a nice way to have a web app running. You can also just extract the parts that you need and use them without Next.js in your website. We just hadn't the requirement yet. But if you need help here, please open an issue and we are happy to extract the parts that are needed, so you can use them in any environment. 
