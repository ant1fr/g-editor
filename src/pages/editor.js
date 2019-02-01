import React from 'react';
import { data, editPost, domReady } from '@frontkom/gutenberg-js';
import { types } from '../globals/fake-data';

// Gutenberg JS Style
import '@frontkom/gutenberg-js/build/css/block-library/style.css';
import '@frontkom/gutenberg-js/build/css/style.css';
import './editor.css';

class Editor extends React.Component {
  constructor (props) {
    super(props);

    let type = window.location.pathname.replace(/\//g, '');
    type = type.slice(0, -1);

    this.state = {
      postType: type || 'page',
    };
  }

  componentDidMount () {
    const { postType } = this.state;

    const settings = {
      alignWide: true,
      availableTemplates: [],
      allowedBlockTypes: true,
      disableCustomColors: false,
      disablePostFormats: false,
      titlePlaceholder: 'Add title',
      bodyPlaceholder: 'Insert your custom block',
      isRTL: false,
      autosaveInterval: 0,
      postLock: {
        isLocked: false,
      },
      canPublish: false,
      canSave: true,
      canAutosave: true,
      mediaLibrary: true,
    };

    // Disable tips
    data.dispatch('core/nux').disableTips();

    // Initialize the editor
    window._wpLoadGutenbergEditor = new Promise(function (resolve) {
      domReady(function () {
        resolve(editPost.initializeEditor('editor', postType, 1, settings, {}));
      });
    });
  }

  resetLocalStorage = ev => {
    ev.preventDefault();
    const { postType } = this.state;

    localStorage.removeItem(`g-editor-${postType}`);
    window.location.reload();
  };

  render () {
    const { postType } = this.state;

    return (
      <React.Fragment>
        <div className="editor-nav">
          {
            Object.keys(types).map(type => {
              return (
                <button
                  key={ type }
                  className={ `components-button ${type === postType ? 'is-primary' : ''}` }
                  onClick={ () => window.location.replace(types[type].rest_base) }
                >{ types[type].name }</button>
              );
            })
          }

          <button type="button" className="components-button is-tertiary"
            onClick={ this.resetLocalStorage }>Clear page and reload</button>
        </div>
        <div id="editor" className="gutenberg__editor"></div>
      </React.Fragment>
    );
  }
}

export default Editor;
