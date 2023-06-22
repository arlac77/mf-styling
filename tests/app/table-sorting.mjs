const SORT_NONE = "none";
const SORT_ASCENDING = "ascending";
const SORT_DESCENDING = "descending";

const orderByCycle = {
  [SORT_NONE]: SORT_ASCENDING,
  [SORT_ASCENDING]: SORT_DESCENDING,
  [SORT_DESCENDING]: SORT_ASCENDING
};

export function toggleSorting(sorter) {
  return event => {
    const node = event.currentTarget;
    const th = node.parentElement;
    const table = th.parentElement.parentElement.parentElement;

    const sort = orderByCycle[th.getAttribute("aria-sort")] || SORT_NONE;
    th.setAttribute("aria-sort", sort);

    sorter(table, parseInt(th.id), sort, "string");

    for (const peer of th.parentElement.children) {
      let sort = peer.getAttribute("aria-sort");
      if (sort) {
        if (peer !== th) {
          if (sort !== SORT_NONE) {
            sort = SORT_NONE;
            peer.setAttribute("aria-sort", sort);
          }
        }
      }
    }
  };
}

export function enableSorting(th, sorter = sortTable) {
  if (th.getAttribute("aria-sort")) {
    const button = document.createElement("button");
    button.setAttribute("class", "alter-sorting");
    button.setAttribute("aria-label", `sortable ${th.id}`);
    button.onclick = toggleSorting(sorter);
    th.appendChild(button);
  }
}

export function sortTable(table, colNum, direction, type) {
  const tbody = table.getElementsByTagName("tbody")[0];

  let m = 1;

  switch (direction) {
    case SORT_ASCENDING:
      m = 1;
      break;
    case SORT_DESCENDING:
      m = -1;
      break;
  }

  let compare;

  switch (type) {
    case "number":
      compare = (rowA, rowB) =>
        (rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML) * m;
      break;

    default:
      compare = (rowA, rowB) =>
        rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML
          ? 1 * m
          : -1 * m;

      break;
  }

  let rows = Array.from(tbody.rows);

  rows.sort(compare);

  tbody.append(...rows);
}
