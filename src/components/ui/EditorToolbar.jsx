import React from "react";
import { Quill } from "react-quill";
import 'react-quill/dist/quill.snow.css';

const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

function undoChange() {
  this.quill.history.undo();
}
function redoChange() {
  this.quill.history.redo();
}

const Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);


const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
];
Quill.register(Font, true);

export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange
    }
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  },
};

export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "color",
];

export const EditorToolbar = ({className, id}) => (
  <div id={id ? id : "toolbar"} className={className ? className : "border border-radius border-secondary"}>
    {/* <span className="ql-formats pointer">
      <select className="ql-size" defaultValue="medium">
        <option value="small">Size 1</option>
        <option value="medium">Size 2</option>
        <option value="large">Size 3</option>
      </select>
    </span> */}
    <span className="ql-formats">
      <button className="icon-btn bg-secondary-hover ql-bold"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Bold"
      />
      <button className="icon-btn bg-secondary-hover ql-italic"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Italic"
      />
      <button className="icon-btn bg-secondary-hover ql-underline"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Underline"
      />
      <button className="icon-btn bg-secondary-hover ql-strike"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Strikethrough"
      />
      <button className="icon-btn bg-secondary-hover ql-list"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="List"
      value="ordered" />
      <button className="icon-btn bg-secondary-hover ql-indent"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Indent"
      value="-1" />
      <button className="icon-btn bg-secondary-hover ql-indent"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Indent"
      value="+1" />
      <select className="icon-btn bg-secondary-hover ql-align"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Align"
        />
      {/* <select className="icon-btn bg-secondary-hover icon-btn-
        data-tooltip-id="tooltip-default"
        data-tooltip-content=""
      ext ql-color" /> */}
      {/* <select className="icon-btn bg-secondary-hover icon-btn-
        data-tooltip-id="tooltip-default"
        data-tooltip-content=""
      ext ql-background" /> */}
      <button className="icon-btn bg-secondary-hover ql-link"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Link"
      />
      <button className="icon-btn bg-secondary-hover ql-clean"
        data-tooltip-id="tooltip-default"
        data-tooltip-content="Clear Formatting"
      />
    </span>
  </div>
);

export default EditorToolbar;