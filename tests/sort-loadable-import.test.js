// sort-loadable-import.test.js
const { RuleTester } = require("eslint");
const loadableImportRule = require("../eslint-rules/sort-loadable-imports");

const ruleTester = new RuleTester();

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  "sort-loadable-import", // rule name
  loadableImportRule, // rule code
  { // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        code: `
          const AComponent = loadable(() => import('@/components/AComponent'));
          const BComponent = loadable(() => import('@/components/BComponent'));
          const CComponent = loadable(() => import('@/components/CComponent'));
        `,
      },{
        code: `
          const First = loadable(() => import('@/components/First'));
          const Second = loadable(() => import('@/components/Second'));
          const Third = loadable(() => import('@/components/Third'));
        `,
      }
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        code: `
          const CComponent = loadable(() => import('@/components/CComponent'));
          const AComponent = loadable(() => import('@/components/AComponent'));
          const BComponent = loadable(() => import('@/components/BComponent'));
        `,
        errors: [
          { message: 'Loadable imports are not sorted alphabetically.' },
          { message: 'Loadable imports are not sorted alphabetically.' },
          { message: 'Loadable imports are not sorted alphabetically.' },
        ],
        output: `
          const AComponent = loadable(() => import('@/components/AComponent'));
          const BComponent = loadable(() => import('@/components/BComponent'));
          const CComponent = loadable(() => import('@/components/CComponent'));
        `,
      },
      {
        code: `
          const Second = loadable(() => import('@/components/Second'));
          const First = loadable(() => import('@/components/First'));
        `,
        errors: [
          { message: 'Loadable imports are not sorted alphabetically.'},
          { message: 'Loadable imports are not sorted alphabetically.'},
        ],
        output: `
          const First = loadable(() => import('@/components/First'));
          const Second = loadable(() => import('@/components/Second'));
        `,
      },
    ],
  }
);