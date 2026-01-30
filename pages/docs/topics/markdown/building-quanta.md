# Building Quanta

> **Last Updated:** January 29, 2026  
> **Version:** 0.1.0  
> **Author:** Ata Türkçü

---

Quanta uses platform-native compilers for optimal performance:

- **Windows**: MSVC (Visual Studio) - Native Windows build
- **Linux**: GCC - Native Linux build
- **macOS**: Clang/AppleClang - Native macOS build

### Quick Start

Clone the Quanta:

```bash
git clone https://github.com/solarbrowser/quanta
cd quanta
```

Universal Build Script (Recommended):

```bash
./build.sh           # Build with Makefile
./build.sh cmake     # Build with CMake
./build.sh clean     # Clean all builds
```

Windows (Native MSVC):

```bash
build-windows.bat    # MSVC
```

Requires: Visual Studio 2019/2022 + CMake

Linux/macOS:

```bash
make -j$(nproc)      # Makefile build
# or
./build.sh cmake     # CMake build
```

### Build Outputs

- Windows MSVC: `build-cmake/bin/Release/quanta.exe` (native)
- Windows MinGW: `build/bin/quanta.exe`
- Linux/macOS: `build/bin/quanta`
- Static Library: `libquanta.a` or `quanta.lib` (MSVC)

### Running Tests

Execute JavaScript code directly:

```bash
./build/bin/quanta -c "console.log('Hello World');"
```

Execute JavaScript file:

```bash
./build/bin/quanta example_file.js
```

Interactive REPL:

```bash
./build/bin/quanta
```

### Requirements

- C++17 compatible compiler
- CMake 3.10 or higher (for CMake builds)
- Make (for Makefile builds on Linux/macOS)

## Troubleshooting

If you encounter build issues:

1. Make sure you have the required compiler installed
2. Check that CMake is in your PATH
3. Try cleaning the build directory: `./build.sh clean`
4. On Windows, ensure Visual Studio is properly installed with C++ tools
