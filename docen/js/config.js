export const docenConfig = {
    title: "Quanta Docs",
    baseDir: "./docs/",
    homePage: "index.md",

    // If you are looking for keyboard shortcuts, they are in "js/app.js" line 353

    // Icon Configuration
    icons: true, // Set false to disable all icons entirely
    showDefaultIcons: true,

    // Developer options
    developerMode: false,
    // If you don't want to see the developer mode icon or if you are planning to release you can set this to false.

    // Sidebar navigation mapping
    // You can nest folders by providing 'folder' and 'children'
    nav: [
        { title: "Overview", file: "index.md", icon: "book-open" },
        {
	         folder: "Contributing", icon: "helping-hand",
	         children: [
				{ title: "Getting Started", file: "contributing/getting-started.md"},
				{ title: "Building", file: "contributing/building.md"},
				{ title: "Extending", file: "contributing/extending.md"},
				{ title: "Code Style", file: "contributing/code-style.md"},
				{ title: "Debugging", file: "contributing/debugging.md"},
				{ title: "Testing", file: "contributing/testing.md"}
         ]
         },
        {
        	folder: "Architecture", icon: "component",
        	children: [
        		{ title: "Overview", file: "architecture/overview.md"},
        		{ title: "Parser", file: "architecture/parser.md"},
        		{ title: "VM", file: "architecture/vm.md"},
        		{ title: "Memory", file: "architecture/memory.md"},
        		{ title: "Runtime", file: "architecture/runtime.md"},
        		{ title: "Host", file: "architecture/host.md"}
        	]
        },
		 {
        	folder: "Internals", icon: "blocks",
        	children: [
        		{ title: "Execution", file: "internals/execution.md"},
        		{ title: "Parser", file: "internals/parser.md"},
        		{ title: "Bytecode", file: "internals/bytecode.md"},
        		{ title: "Memory", file: "internals/memory.md"},
        		{ title: "Garbage Collector", file: "internals/gc.md"},
        		{ title: "Builtins", file: "internals/builtins.md"},
        		{ title: "Representation", file: "internals/representation.md"}
        	]
        },
        {
        	folder: "Reference", icon: "book",
        	children: [
        		{ title: "Configuration", file: "reference/configuration.md"},
        		{ title: "CLI", file: "reference/cli.md"}
        	]
        }
        
    ]
};
