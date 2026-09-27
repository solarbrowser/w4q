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
				{ title: "Getting Started", file: "Contributing/getting-started.md"},
				{ title: "Building", file: "Contributing/building.md"},
				{ title: "Extending", file: "Contributing/extending.md"},
				{ title: "Code Style", file: "Contributing/code-style.md"},
				{ title: "Debugging", file: "Contributing/debugging.md"},
				{ title: "Testing", file: "Contributing/testing.md"}
         ]
         },
        {
        	folder: "Architecture", icon: "component",
        	children: [
        		{ title: "Overview", file: "Architecture/overview.md"},
        		{ title: "Parser", file: "Architecture/parser.md"},
        		{ title: "VM", file: "Architecture/vm.md"},
        		{ title: "Memory", file: "Architecture/memory.md"},
        		{ title: "Runtime", file: "Architecture/runtime.md"},
        		{ title: "Host", file: "Architecture/host.md"}
        	]
        },
		 {
        	folder: "Internals", icon: "blocks",
        	children: [
        		{ title: "Execution", file: "Internals/execution.md"},
        		{ title: "Parser", file: "Internals/parser.md"},
        		{ title: "Bytecode", file: "Internals/bytecode.md"},
        		{ title: "Memory", file: "Internals/memory.md"},
        		{ title: "Garbage Collector", file: "Internals/gc.md"},
        		{ title: "Builtins", file: "Internals/builtins.md"},
        		{ title: "Representation", file: "Internals/representation.md"}
        	]
        },
        {
        	folder: "Reference", icon: "book",
        	children: [
        		{ title: "Configuration", file: "Reference/configuration.md"},
        		{ title: "CLI", file: "Reference/cli.md"}
        	]
        }
        
    ]
};
