const prender = require("preact-render-to-string");
const htm = require("htm");
const { h } = require("preact");
const pmap = require("promise-map");

function flattenArray(arr) {
  return arr.reduce(function(accumulator, currentValue) {
    return accumulator.concat(currentValue);
  }, []);
}

function flattenTree(t) {
  if (t.children) {
    t.children = flattenArray(t.children).map(flattenTree);
  }

  return t;
}

exports.render = async function render(tree) {
  const promises = [];

  function walk(t, promises = []) {
    if (t.children) {
      for (const [i, child] of t.children.entries()) {
        if (child instanceof Promise) {
          promises.push(
            child.then(val => {
              t.children[i] = val;
              return Promise.all(walk(val));
            })
          );
        } else if (child.children) {
          walk(child, promises);
        }
      }
    }

    return promises;
  }

  // for now, one error crashes the whole thing
  // in the future we can implement boundaries
  await Promise.all(walk(tree));

  // when we resolve to arrays, preact is not able
  // to render nested lists of children, so we flatten
  flattenTree(tree);

  return prender(tree);
};

exports.html = htm.bind(h);

exports.map = function map(p, fn) {
  return p.then(pmap(fn));
};
