import * as React from 'react';
import { Package } from '../types';
import PackageName from './PackageName';

interface Props {
  package: Package,
  nameList: string[]
};

export default class PackageInfo extends React.Component<Props> {
  render() {
    return (
      <div className="package-info">
        {this.renderTitle()}
        {this.renderDependencies()}
        {this.renderDependentPackages()}
        {this.renderDescription()}
      </div>
    );
  }

  renderTitle() {
    const { package: pkg } = this.props;
    return (
      <div className="section">
        <h3>{pkg.name}</h3>
      </div>
    );
  }

  renderDependencies() {
    const { package: pkg } = this.props;
    const { dependencies } = pkg;
    return (
      <div className="section">
        <div className="section-title">Dependencies</div>
        <div>
          {dependencies.map(dependency => (
            <div key={dependency.main}>
              {this.renderName(dependency.main)}
              {dependency.alternatives.map(name => (
                <React.Fragment key={name}>
                  {' | '}
                  {this.renderName(name)}
                </React.Fragment>

              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderDependentPackages() {
    const { package: pkg } = this.props;
    const { dependentPackages } = pkg;
    return (
      <div className="section">
        <div className="section-title">Dependent packages</div>
        <div>
          {dependentPackages.map(name => (
            <div key={name}>
              {this.renderName(name)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderDescription() {
    const { package: pkg } = this.props;
    return (
      <div className="section">
        <div className="section-title">Description</div>
        <div className="description">{pkg.description}</div>
      </div>
    );
  }

  renderName = (name: string) => {
    const { nameList } = this.props;
    return (
      <PackageName name={name} isLink={nameList.includes(name)} />
    );
  }
}
