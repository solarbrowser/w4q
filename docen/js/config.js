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
        { title: "Build", file: "build.md", icon: "wrench" },
        { title: "Architecture", file: "architecture.md", icon: "blocks" },
        { title: "Contributing", file: "contributing.md", icon: "users" }
    ]
};
