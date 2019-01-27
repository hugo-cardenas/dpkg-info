import * as React from 'react';
import history from './history';
import PackageInfo from './PackageInfo';
import PackageName from './PackageName';
import { PackageDictionary } from '../types';
import './styles.css';

interface Props { };
interface State {
  pathname: string,
  isLoading: boolean,
  packageDictionary: PackageDictionary
};

export default class App extends React.Component<Props, State> {
  state = {
    pathname: '',
    isLoading: true,
    packageDictionary: {}
  }

  componentDidMount() {
    const { pathname } = history.location;
    fetch('/api/packages')
      .then(response => response.json())
      .then(packageDictionary => {
        this.setState({ isLoading: false, pathname, packageDictionary })
      })
      .catch(console.error);

    history.listen(location => {
      this.setState({ pathname: location.pathname });
      window.scrollTo(0, 0);
    });
  }

  render() {
    return (
      <div className="root-container">
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { isLoading, pathname } = this.state;
    const matches = pathname.match(/package\/(.+)/);
    const packageName = matches ? matches[1] : null;

    if (isLoading) {
      return 'LOADING...';
    }

    return packageName ?
      this.renderPackageInfo(packageName) :
      this.renderPackageList();
  }

  renderPackageList() {
    const names = Object.keys(this.state.packageDictionary);
    names.sort();
    return (
      <div>
        <h2>Packages</h2>
        {names.length > 0 ?
          <ul className="package-list">
            {names.map((name) => (
              <li key={name}>
                <PackageName name={name} isLink={true} />
              </li>
            ))}
          </ul> :
          <p>No packages</p>
        }
      </div>
    );
  }

  renderPackageInfo(name: string) {
    const pkg = this.state.packageDictionary[name];
    const nameList = Object.keys(this.state.packageDictionary);
    return (
      <PackageInfo package={pkg} nameList={nameList} />
    );
  }
}
