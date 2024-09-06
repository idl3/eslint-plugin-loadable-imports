module.exports = {
  meta: {
    type: "suggestion",
    docs: {
        description: "Sort all loadable imports alphabetically in a file",
        category: 'Stylistic Issues',
        recommended: false,
    },
    fixable: "code",
    schema: []
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    function isLoadableDeclaration(node) {
      return (
        node.type === 'VariableDeclaration' &&
        node.declarations[0]?.init?.callee?.name === 'loadable'
      );
    }

    function getImportInfo(statement) {
      const declaration = statement.declarations[0];
      return {
        declaration,
        text: sourceCode.getText(statement),
        name: declaration.id.name,
        node: statement,
        range: statement.range,
      };
    }

    function checkAndReportUnsortedImports(loadableImports) {
      const sortedNames = new Set(loadableImports.map(imp => imp.name).sort());
      let isSorted = true;
      let firstUnsortedIndex = -1;

      for (let i = 0; i < loadableImports.length; i++) {
        if (loadableImports[i].name !== Array.from(sortedNames)[i]) {
          isSorted = false;
          firstUnsortedIndex = i;
          break;
        }
      }

      if (!isSorted) {
        context.report({
          node: loadableImports[firstUnsortedIndex].node,
          message: 'Loadable imports are not sorted alphabetically.',
          fix(fixer) {
            const [firstImport] = loadableImports;
            const indentation = ' '.repeat(firstImport.range[0] - 1);
            const sortedCode = Array.from(sortedNames)
              .map(name => loadableImports.find(imp => imp.name === name).text.trim())
              .join(`\n${indentation}`);

            return fixer.replaceTextRange(
              [firstImport.range[0], loadableImports[loadableImports.length - 1].range[1]],
              sortedCode
            );
          },
        });
      }
    }

    return {
      Program(node) {
        const loadableImports = node.body
          .filter(isLoadableDeclaration)
          .map(getImportInfo);

        if (loadableImports.length > 1) {
          checkAndReportUnsortedImports(loadableImports);
        }
      },
    };
  }
};