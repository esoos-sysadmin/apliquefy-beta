# PyInstaller spec for the Apliquefy Robots engine.
#
# Build with: `pyinstaller apps/robots/build.spec`
# Output:     `dist/robots/robots` (single executable + bundled deps)
#
# The Electron build copies the resulting folder into resourcesPath/robots.
# Playwright browsers are installed at runtime via `playwright install` post-build,
# OR shipped under `extraResources` (preferred for offline installs).

# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_all

datas = []
binaries = []
hiddenimports = []
for pkg in ("openai", "playwright", "reportlab"):
    d, b, h = collect_all(pkg)
    datas += d
    binaries += b
    hiddenimports += h

a = Analysis(
    ['src/rpa_engine/__main__.py'],
    pathex=['src'],
    binaries=binaries,
    datas=datas + [('src/rpa_engine/cognitive/prompts/system.md', 'rpa_engine/cognitive/prompts')],
    hiddenimports=hiddenimports,
)

pyz = PYZ(a.pure, a.zipped_data)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='robots',
    debug=False,
    strip=False,
    upx=False,
    console=True,
)

coll = COLLECT(exe, a.binaries, a.zipfiles, a.datas, name='robots')
