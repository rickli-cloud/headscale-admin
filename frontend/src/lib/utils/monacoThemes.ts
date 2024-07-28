import type { editor } from 'monaco-editor';

export const themes: { [x: string]: editor.IStandaloneThemeData } = {
	customDark: {
		base: 'vs-dark',
		inherit: true,
		rules: [],
		colors: {
			'editor.foreground': '#FFFFFF',
			'editor.background': '#09090b',
			'editor.selectionBackground': '#2a2a2b',
			'editor.lineHighlightBackground': '#2a2a2b',
			'editorCursor.foreground': '#FFFFFF',
			'editorWhitespace.foreground': '#FFFFFF'
		}
	},

	customWhite: {
		base: 'vs',
		inherit: true,
		rules: [
			{
				foreground: '#000000',
				token: 'comment'
			}
		],
		colors: {
			'editor.foreground': '#000000',
			'editor.background': '#FFFFFF',
			'editor.selectionBackground': '#FEFEFE',
			'editor.lineHighlightBackground': '#FEFEFE',
			'editorCursor.foreground': '#000000',
			'editorWhitespace.foreground': '#000000'
		}
	}

	/* exampleTheme: {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        foreground: "aeaeae",
        token: "comment",
      },
      {
        foreground: "d8fa3c",
        token: "constant",
      },
      {
        foreground: "ff6400",
        token: "entity",
      },
      {
        foreground: "fbde2d",
        token: "keyword",
      },
      {
        foreground: "fbde2d",
        token: "storage",
      },
      {
        foreground: "61ce3c",
        token: "string",
      },
      {
        foreground: "61ce3c",
        token: "meta.verbatim",
      },
      {
        foreground: "8da6ce",
        token: "support",
      },
      {
        foreground: "ab2a1d",
        fontStyle: "italic",
        token: "invalid.deprecated",
      },
      {
        foreground: "f8f8f8",
        background: "9d1e15",
        token: "invalid.illegal",
      },
      {
        foreground: "ff6400",
        fontStyle: "italic",
        token: "entity.other.inherited-class",
      },
      {
        foreground: "ff6400",
        token: "string constant.other.placeholder",
      },
      {
        foreground: "becde6",
        token: "meta.function-call.py",
      },
      {
        foreground: "7f90aa",
        token: "meta.tag",
      },
      {
        foreground: "7f90aa",
        token: "meta.tag entity",
      },
      {
        foreground: "ffffff",
        token: "entity.name.section",
      },
      {
        foreground: "d5e0f3",
        token: "keyword.type.variant",
      },
      {
        foreground: "f8f8f8",
        token: "source.ocaml keyword.operator.symbol",
      },
      {
        foreground: "8da6ce",
        token: "source.ocaml keyword.operator.symbol.infix",
      },
      {
        foreground: "8da6ce",
        token: "source.ocaml keyword.operator.symbol.prefix",
      },
      {
        fontStyle: "underline",
        token: "source.ocaml keyword.operator.symbol.infix.floating-point",
      },
      {
        fontStyle: "underline",
        token: "source.ocaml keyword.operator.symbol.prefix.floating-point",
      },
      {
        fontStyle: "underline",
        token: "source.ocaml constant.numeric.floating-point",
      },
      {
        background: "ffffff08",
        token: "text.tex.latex meta.function.environment",
      },
      {
        background: "7a96fa08",
        token:
          "text.tex.latex meta.function.environment meta.function.environment",
      },
      {
        foreground: "fbde2d",
        token: "text.tex.latex support.function",
      },
      {
        foreground: "ffffff",
        token: "source.plist string.unquoted",
      },
      {
        foreground: "ffffff",
        token: "source.plist keyword.operator",
      },
    ],
    colors: {
      "editor.foreground": "#F8F8F8",
      "editor.background": "#0C1021",
      "editor.selectionBackground": "#253B76",
      "editor.lineHighlightBackground": "#FFFFFF0F",
      "editorCursor.foreground": "#FFFFFFA6",
      "editorWhitespace.foreground": "#FFFFFF40",
    },
  }, */
};
