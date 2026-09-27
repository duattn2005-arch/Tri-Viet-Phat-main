/* global CMS, createClass, h, Jodit, marked */
// "html" widget for Decap CMS: a Word-like editor (Jodit) that edits article bodies as HTML.
// Most articles came from the old WordPress site as HTML, which Decap's Markdown editor can only show as raw code.
// Entries still written in Markdown are converted to HTML when opened; the site renders both (src/content/load.ts).
(function () {
  var looksLikeHtml = function (text) {
    return /<\/?(p|h[1-6]|div|ul|ol|li|table|img|strong|em|a|br|span|figure|blockquote)\b/i.test(text);
  };
  var toHtml = function (value) {
    var text = value || '';
    if (!text.trim() || looksLikeHtml(text)) return text;
    return marked.parse(text, { async: false });
  };

  var nextId = 0;

  var HtmlControl = createClass({
    componentDidMount: function () {
      var self = this;
      this.controlID = 'html-widget-' + ++nextId;
      this.editor = Jodit.make(this.textarea, {
        height: 560,
        minHeight: 300,
        toolbarAdaptive: false,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',
        uploader: { insertImageAsBase64URI: false },
        buttons: [
          'paragraph', 'bold', 'italic', 'underline', 'strikethrough', '|',
          'ul', 'ol', 'align', '|',
          'link', 'libraryImage', 'image', 'video', 'table', '|',
          'brush', 'fontsize', 'hr', 'eraser', '|',
          'undo', 'redo', 'source', 'fullsize',
        ],
        controls: {
          libraryImage: {
            icon: 'image',
            tooltip: 'Chèn ảnh (tải lên hoặc chọn trong thư viện)',
            exec: function () {
              self.props.onOpenMediaLibrary({ controlID: self.controlID, forImage: true, allowMultiple: false });
            },
          },
        },
      });
      this.editor.value = toHtml(this.props.value);
      this.lastValue = this.editor.value;
      this.editor.events.on('change', function (html) {
        if (html === self.lastValue) return;
        self.lastValue = html;
        self.props.onChange(html);
      });
    },

    componentDidUpdate: function () {
      // A picture chosen in the media library comes back through mediaPaths
      var paths = this.props.mediaPaths;
      var picked = paths && paths.get && paths.get(this.controlID);
      if (!picked) return;
      this.props.onRemoveInsertedMedia(this.controlID);
      var src = typeof picked === 'string' ? picked : picked.path || picked.url;
      if (src) this.editor.s.insertImage(src, null, '');
    },

    componentWillUnmount: function () {
      if (this.editor) this.editor.destruct();
    },

    shouldComponentUpdate: function (next) {
      // Jodit owns the DOM inside; only react to a picked image
      return next.mediaPaths !== this.props.mediaPaths;
    },

    render: function () {
      var self = this;
      return h(
        'div',
        { className: this.props.classNameWrapper, style: { padding: 0, overflow: 'visible' } },
        h('textarea', { ref: function (el) { self.textarea = el; } })
      );
    },
  });

  var HtmlPreview = createClass({
    render: function () {
      return h('div', { dangerouslySetInnerHTML: { __html: toHtml(this.props.value) } });
    },
  });

  CMS.registerWidget('html', HtmlControl, HtmlPreview);
})();
