import { j as jsxRuntimeExports } from './jsx-runtime-XI9uIe3W.js';

function HelloWorld() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold text-gray-900 dark:text-gray-50", children: "Hello World" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-gray-600 dark:text-gray-400", children: "Welcome to Care Kutumba" })
  ] }) });
}

const routes = {
  "/hello": () => /* @__PURE__ */ jsxRuntimeExports.jsx(HelloWorld, {})
};

const manifest = {
  plugin: "care-kutumba-fe",
  routes,
  extends: [],
  components: {},
  devices: []
};

export { manifest as default };
