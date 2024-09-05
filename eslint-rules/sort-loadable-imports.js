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
    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const loadableImports = [];

        // Go through each top-level statement and look for "loadable" assignments
        node.body.forEach(statement => {
          if (
            statement.type === 'VariableDeclaration' && 
            statement.declarations[0]?.init?.callee?.name === 'loadable'
          ) {
            const declaration = statement.declarations[0];

            loadableImports.push({
              declaration,
              text: sourceCode.getText(statement),
              name: declaration.id.name,
              node: statement, // Get the actual import text for sorting/fixing
              range: statement.range, // Save the range to preserve original formatting
            });
          }
        });

        // Check if the imports are sorted alphabetically
        const sortedImports = [...loadableImports].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        loadableImports.forEach((importObj, index) => {
          if (importObj.name !== sortedImports[index].name) {
            context.report({
              node: importObj.node,
              message: 'Loadable imports are not sorted alphabetically.',
              fix(fixer) {
                const firstCharPosition = loadableImports[0].range[0]
                const indentation =  firstCharPosition - 1;

                const sortedCode = sortedImports
                  .map(sortedImport => {
                    return sortedImport.text.trim();
                  })
                  // add indentation.length * space after line break
                  .join(`\n${' '.repeat(indentation)}`);


                return fixer.replaceTextRange(
                  [
                    loadableImports[0].range[0],
                    loadableImports[loadableImports.length - 1].range[1],
                  ],
                  sortedCode
                );
              },
            });
          }
        });
      },
    };
  }
};