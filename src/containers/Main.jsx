import React from 'react';
import Progress from 'react-progress-2';

import Header from '../components/Header';
import Editors from '../components/Editors';
import Sandbox from '../components/Sandbox'

const HEADER_HEIGHT = 38;

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            bundle: {},
            bundling: false,
            activeEditor: 'code'
        };
    }

    handleRunClick() {
        const bundle = this.refs.editors.getBundle();
        this.setState({ bundle });
    }

    handleChangeEditor(activeEditor) {
        this.setState({ activeEditor });
    }

    handleStartBundle() {
        this.progressDelay = setTimeout(() => Progress.show(), 100);
    }

    handleEndBundle() {
        clearTimeout(this.progressDelay);
        Progress.hide();
    }

    updateDependencies(modules) {
        const { bundle } = this.state;
        const updatedPackage = Object.assign({}, bundle.package, {
            dependencies: modules.reduce((memo, mod) => {
                memo[mod.name] = mod.version;
                return memo;
            }, {})
        });
        this.refs.editors.updatePackage(updatedPackage);
    }

    render() {
        const { bundle, activeEditor } = this.state;

        return (
            <div className="main">
                <Progress.Component />

                <Header
                    height={HEADER_HEIGHT}
                    activeEditor={activeEditor}
                    onRunClick={::this.handleRunClick}
                    onEditorClick={::this.handleChangeEditor}
                />

                <div className="content">
                    <Editors
                        ref="editors"
                        active={activeEditor}
                        headerHeight={HEADER_HEIGHT}
                        onCodeChange={""}
                        onHTMLChange={""}
                        onPackageChange={""}
                    />

                    <Sandbox
                        bundle={bundle}
                        onModules={::this.updateDependencies}
                        onStartBundle={::this.handleStartBundle}
                        onEndBundle={::this.handleEndBundle}
                    />
                </div>
            </div>
        );
    }
}

export default Main;
