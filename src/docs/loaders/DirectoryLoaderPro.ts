import { DirectoryLoader, UnknownHandling } from "langchain/document_loaders/fs/directory";

export class DirectoryLoaderPro extends DirectoryLoader {
	ignoredFolders: string[];

	constructor(
		directoryPath: string,
		loaders: any,
		ignoredFolders: string[],
		recursive: boolean = true,
		unknown: UnknownHandling = UnknownHandling.Warn
	) {
		super(directoryPath, loaders, recursive, unknown);
		this.ignoredFolders = ignoredFolders;
	}

	async load(): Promise<any> {
		let documents = await super.load();

		// Get rid of files that are part of ignoredFolders
		documents = documents.filter(
			document =>
				!this.ignoredFolders.some(folder => document.metadata.source.includes(folder))
		);

		// documents.map(document => {
		// 	console.log(document.metadata.source);
		// });

		return documents;
	}
}
