# Building Quanta

> **Last Updated:** February 2, 2026
> **Version:** 0.1.0.3052126
> **Author:** Ata Türkçü

---

Quanta uses **Clang++** for all platforms.

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

Windows (Clang):

```bash
build-windows.bat
```

Requires: LLVM/Clang installed and in PATH

Linux/macOS:

```bash
make -j$(nproc)      # Makefile build
# or
./build.sh cmake     # CMake build
```

### Build Outputs

- Windows: `build/bin/quanta.exe`
- Linux/macOS: `build/bin/quanta`
- Static Library: `build/libquanta.a`

### Running Tests

Execute JavaScript code directly:

```bash
./build/bin/quanta -c "console.log('Hello World')"
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
- Clang/LLVM 10 or higher
- Make (for Makefile builds on Linux/macOS)

### Installing Clang

**Windows:**
1. Download LLVM from [llvm.org/releases](https://github.com/llvm/llvm-project/releases)
2. Install and select "Add LLVM to system PATH"
3. Verify: `clang++ --version`

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install clang lld

# Fedora
sudo dnf install clang lld

# Arch
sudo pacman -S clang lld
```

**macOS:**
```bash
# Clang included with Xcode Command Line Tools
xcode-select --install
```

## Troubleshooting

If you encounter build issues:

1. Make sure you have Clang installed and in PATH
2. Check that Clang version is 10 or higher: `clang++ --version`
3. Try cleaning the build directory: `./build.sh clean` or `make clean`
4. On Windows, restart terminal/IDE after installing LLVM
5. Check build logs: `build/build.log` and `build/errors.log`
