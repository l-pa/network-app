(function (undefined) {
  /**
   * GEXF Library
   * =============
   *
   * Author: PLIQUE Guillaume (Yomguithereal)
   * URL: https://github.com/Yomguithereal/gexf-parser
   * Version: 0.1.1
   */

  /**
   * Helper Namespace
   * -----------------
   *
   * A useful batch of function dealing with DOM operations and types.
   */
  const _helpers = {
    getModelTags(xml) {
      const attributesTags = xml.getElementsByTagName("attributes");
      const modelTags = {};
      const l = attributesTags.length;
      let i;

      for (i = 0; i < l; i++)
        modelTags[attributesTags[i].getAttribute("class")] =
          attributesTags[i].childNodes;

      return modelTags;
    },
    nodeListToArray(nodeList) {
      // Return array
      const children = [];

      // Iterating
      for (let i = 0, len = nodeList.length; i < len; ++i) {
        if (nodeList[i].nodeName !== "#text") children.push(nodeList[i]);
      }

      return children;
    },
    nodeListEach(nodeList, func) {
      // Iterating
      for (let i = 0, len = nodeList.length; i < len; ++i) {
        if (nodeList[i].nodeName !== "#text") func(nodeList[i]);
      }
    },
    nodeListToHash(nodeList, filter) {
      // Return object
      const children = {};

      // Iterating
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].nodeName !== "#text") {
          const prop = filter(nodeList[i]);
          children[prop.key] = prop.value;
        }
      }

      return children;
    },
    namedNodeMapToObject(nodeMap) {
      // Return object
      const attributes = {};

      // Iterating
      for (let i = 0; i < nodeMap.length; i++) {
        attributes[nodeMap[i].name] = nodeMap[i].value;
      }

      return attributes;
    },
    getFirstElementByTagNS(node, ns, tag) {
      let el = node.getElementsByTagName(`${ns}:${tag}`)[0];

      if (!el) el = node.getElementsByTagNameNS(ns, tag)[0];

      if (!el) el = node.getElementsByTagName(tag)[0];

      return el;
    },
    getAttributeNS(node, ns, attribute) {
      let attr_value = node.getAttribute(`${ns}:${attribute}`);

      if (attr_value === undefined)
        attr_value = node.getAttributeNS(ns, attribute);

      if (attr_value === undefined) attr_value = node.getAttribute(attribute);

      return attr_value;
    },
    enforceType(type, value) {
      switch (type) {
        case "boolean":
          value = value === "true";
          break;

        case "integer":
        case "long":
        case "float":
        case "double":
          value = +value;
          break;

        case "liststring":
          value = value ? value.split("|") : [];
          break;
      }

      return value;
    },
    getRGB(values) {
      return values[3]
        ? `rgba(${values.join(",")})`
        : `rgb(${values.slice(0, -1).join(",")})`;
    }
  };

  /**
   * Parser Core Functions
   * ----------------------
   *
   * The XML parser's functions themselves.
   */

  /**
   * Node structure.
   * A function returning an object guarded with default value.
   *
   * @param  {object} properties The node properties.
   * @return {object}            The guarded node object.
   */
  function Node(properties) {
    // Possible Properties
    const node = {
      id: properties.id,
      label: properties.label
    };

    if (properties.viz) node.viz = properties.viz;

    if (properties.attributes) node.attributes = properties.attributes;

    return node;
  }

  /**
   * Edge structure.
   * A function returning an object guarded with default value.
   *
   * @param  {object} properties The edge properties.
   * @return {object}            The guarded edge object.
   */
  function Edge(properties) {
    // Possible Properties
    const edge = {
      id: properties.id,
      type: properties.type || "undirected",
      label: properties.label || "",
      source: properties.source,
      target: properties.target,
      weight: +properties.weight || 1.0
    };

    if (properties.viz) edge.viz = properties.viz;

    if (properties.attributes) edge.attributes = properties.attributes;

    return edge;
  }

  /**
   * Graph parser.
   * This structure parse a gexf string and return an object containing the
   * parsed graph.
   *
   * @param  {string} xml The xml string of the gexf file to parse.
   * @return {object}     The parsed graph.
   */
  function Graph(xml, err) {
    const _xml = {};
    try {
      // Basic Properties
      //------------------
      _xml.els = {
        root: xml.getElementsByTagName("gexf")[0],
        graph: xml.getElementsByTagName("graph")[0],
        meta: xml.getElementsByTagName("meta")[0],
        nodes: xml.getElementsByTagName("node"),
        edges: xml.getElementsByTagName("edge"),
        model: _helpers.getModelTags(xml)
      };

      // Information
      _xml.hasViz = !!_helpers.getAttributeNS(_xml.els.root, "xmlns", "viz");
      _xml.version = _xml.els.root.getAttribute("version") || "1.0";
      _xml.mode = _xml.els.graph.getAttribute("mode") || "static";

      const edgeType = _xml.els.graph.getAttribute("defaultedgetype");
      _xml.defaultEdgetype = edgeType || "undirected";
    } catch (error) {
      err();
    }
    // Parser Functions
    //------------------

    // Meta Data
    function _metaData() {
      const metas = {};
      if (!_xml.els.meta) return metas;

      // Last modified date
      metas.lastmodifieddate = _xml.els.meta.getAttribute("lastmodifieddate");

      // Other information
      _helpers.nodeListEach(_xml.els.meta.childNodes, function (child) {
        metas[child.tagName.toLowerCase()] = child.textContent;
      });

      return metas;
    }

    // Model
    function _model(cls) {
      const attributes = [];

      // Iterating through attributes
      if (_xml.els.model[cls])
        _helpers.nodeListEach(_xml.els.model[cls], function (attr) {
          // Properties
          const properties = {
            id: attr.getAttribute("id") || attr.getAttribute("for"),
            type: attr.getAttribute("type") || "string",
            title: attr.getAttribute("title") || ""
          };

          // Defaults
          const default_el = _helpers.nodeListToArray(attr.childNodes);

          if (default_el.length > 0)
            properties.defaultValue = default_el[0].textContent;

          // Creating attribute
          attributes.push(properties);
        });

      return attributes.length > 0 ? attributes : false;
    }

    // Data from nodes or edges
    function _data(model, node_or_edge) {
      const data = {};
      const attvalues_els = node_or_edge.getElementsByTagName("attvalue");

      // Getting Node Indicated Attributes
      const ah = _helpers.nodeListToHash(attvalues_els, function (el) {
        const attributes = _helpers.namedNodeMapToObject(el.attributes);
        const key = attributes.id || attributes.for;

        // Returning object
        return { key, value: attributes.value };
      });

      // Iterating through model
      model.map(function (a) {
        // Default value?
        data[a.id] =
          !(a.id in ah) && "defaultValue" in a
            ? _helpers.enforceType(a.type, a.defaultValue)
            : _helpers.enforceType(a.type, ah[a.id]);
      });

      return data;
    }

    // Nodes
    function _nodes(model) {
      const nodes = [];

      // Iteration through nodes
      _helpers.nodeListEach(_xml.els.nodes, function (n) {
        // Basic properties
        const properties = {
          id: n.getAttribute("id"),
          label: n.getAttribute("label") || ""
        };

        // Retrieving data from nodes if any
        if (model) properties.attributes = _data(model, n);

        // Retrieving viz information
        if (_xml.hasViz) properties.viz = _nodeViz(n);

        // Pushing node
        nodes.push(Node(properties));
      });

      return nodes;
    }

    // Viz information from nodes
    function _nodeViz(node) {
      const viz = {};

      // Color
      const color_el = _helpers.getFirstElementByTagNS(node, "viz", "color");

      if (color_el) {
        const color = ["r", "g", "b", "a"].map(function (c) {
          return color_el.getAttribute(c);
        });

        viz.color = _helpers.getRGB(color);
      }

      // Position
      const pos_el = _helpers.getFirstElementByTagNS(node, "viz", "position");

      viz.position = {};
      if (pos_el) {
        ["x", "y", "z"].map(function (p) {
          viz.position[p] = +pos_el.getAttribute(p);
        });
      } else {
        viz.position.x = Math.random();
        viz.position.y = Math.random();
      }

      // Size
      const size_el = _helpers.getFirstElementByTagNS(node, "viz", "size");
      if (size_el) viz.size = +size_el.getAttribute("value");
      else viz.size = 1;

      // Shape
      const shape_el = _helpers.getFirstElementByTagNS(node, "viz", "shape");
      if (shape_el) viz.shape = shape_el.getAttribute("value");

      return viz;
    }

    // Edges
    function _edges(model, default_type) {
      const edges = [];

      // Iteration through edges
      _helpers.nodeListEach(_xml.els.edges, function (e) {
        // Creating the edge
        const properties = _helpers.namedNodeMapToObject(e.attributes);
        if (!("type" in properties)) {
          properties.type = default_type;
        }

        // Retrieving edge data
        if (model) properties.attributes = _data(model, e);

        // Retrieving viz information
        if (_xml.hasViz) properties.viz = _edgeViz(e);

        edges.push(Edge(properties));
      });

      return edges;
    }

    // Viz information from edges
    function _edgeViz(edge) {
      const viz = {};

      // Color
      const color_el = _helpers.getFirstElementByTagNS(edge, "viz", "color");

      if (color_el) {
        const color = ["r", "g", "b", "a"].map(function (c) {
          return color_el.getAttribute(c);
        });

        viz.color = _helpers.getRGB(color);
      }

      // Shape
      const shape_el = _helpers.getFirstElementByTagNS(edge, "viz", "shape");
      if (shape_el) viz.shape = shape_el.getAttribute("value");

      // Thickness
      const thick_el = _helpers.getFirstElementByTagNS(
        edge,
        "viz",
        "thickness"
      );
      if (thick_el) viz.thickness = +thick_el.getAttribute("value");

      return viz;
    }

    // Returning the Graph
    //---------------------
    const nodeModel = _model("node");
    const edgeModel = _model("edge");

    const graph = {
      version: _xml.version,
      mode: _xml.mode,
      defaultEdgeType: _xml.defaultEdgetype,
      meta: _metaData(),
      model: {},
      nodes: _nodes(nodeModel),
      edges: _edges(edgeModel, _xml.defaultEdgetype)
    };

    if (nodeModel) graph.model.node = nodeModel;
    if (edgeModel) graph.model.edge = edgeModel;

    return graph;
  }

  /**
   * Public API
   * -----------
   *
   * User-accessible functions.
   */

  // Fetching GEXF with XHR
  function fetch(gexf_url, callback) {
    const xhr = (function () {
      if (window.XMLHttpRequest) return new XMLHttpRequest();

      let names;
      let i;

      if (window.ActiveXObject) {
        names = [
          "Msxml2.XMLHTTP.6.0",
          "Msxml2.XMLHTTP.3.0",
          "Msxml2.XMLHTTP",
          "Microsoft.XMLHTTP"
        ];

        for (i in names)
          try {
            return new ActiveXObject(names[i]);
          } catch (e) { }
      }

      return null;
    })();

    if (!xhr) throw "XMLHttpRequest not supported, cannot load the file.";

    // Async?
    const async = typeof callback === "function";
    let getResult;

    // If we can't override MIME type, we are on IE 9
    // We'll be parsing the response string then.
    if (xhr.overrideMimeType) {
      xhr.overrideMimeType("text/xml");
      getResult = function (r) {
        return r.responseXML;
      };
    } else {
      getResult = function (r) {
        const p = new DOMParser();
        return p.parseFromString(r.responseText, "application/xml");
      };
    }

    xhr.open("GET", gexf_url, async);

    if (async)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) callback(getResult(xhr));
      };

    xhr.send();

    return async ? xhr : getResult(xhr);
  }

  // Parsing the GEXF File
  function parse(gexf, err) {
    return Graph(gexf, err);
  }

  // Fetch and parse the GEXF File
  function fetchAndParse(gexf_url, callback, err) {
    if (typeof callback === "function") {
      return fetch(gexf_url, function (gexf) {
        callback(Graph(gexf, err));
      });
    }
    return Graph(fetch(gexf_url), err);
  }

  /**
   * Exporting
   * ----------
   */
  if (typeof this.gexf !== "undefined")
    throw 'gexf: error - a variable called "gexf" already ' +
    "exists in the global scope";

  this.gexf = {
    // Functions
    parse,
    fetch: fetchAndParse,

    // Version
    version: "0.1.1"
  };
  if (typeof exports !== "undefined" && this.exports !== exports)
    module.exports = this.gexf;
}.call(this));
