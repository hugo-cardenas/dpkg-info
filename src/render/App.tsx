import * as React from 'react';
import { createBrowserHistory } from 'history';
import './styles.css';

const history = createBrowserHistory();


export default class App extends React.Component {
  state = {
    pathname: '',
    isLoading: true,
    packages: [],
    packageName: null
  }

  componentDidMount() {
    const { pathname } = history.location;
    fetch('/api/packages')
      .then(response => response.json())
      .then(packages => {
        this.setState({ isLoading: false, pathname, packages })
      })
      .catch(console.error);

    window.onpopstate = () => {
      console.log(this);
      this.render();
    }

    history.listen((location, action) => {
      // location is an object like window.location
      // console.log(action, location.pathname, location.state);
      this.setState({ pathname: location.pathname });
    });
    
  }

  navigateToUrl = () => {

  }

  render() {
    return (
      <div className="root-container">
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { isLoading, pathname } = this.state;
    const matches = pathname.match(/package\/(.+)/);
    const packageName = matches ? matches[1] : null;

    console.log('RENDER CONTENT', pathname, packageName);
    

    if (isLoading) {
      return 'LOADING';
    }

    return packageName ?
      this.renderPackageInfo(packageName) :
      this.renderPackageList();
  }

  renderPackageList() {
    console.log('RENDER PACKAGE LIST');

    const names = Object.keys(this.state.packages);
    names.sort();

    return (
      <div>
        <h1>Packages:</h1>
        {names.length > 0 ?
          <ul className="package-list">
            {names.map(name => (
              <li key={name} onClick={() => this.onPackageClick(name)}>
                <a href="#" onClick={e => e.preventDefault()}>{name}</a>
              </li>
            ))}
          </ul> :
          <p>No packages</p>
        }
      </div>
    );
  }

  renderPackageInfo(packageName) {
    const pkg = this.state.packages[packageName];
    if (!pkg) {
      return (
        <div>
          <p>Package not found</p>
        </div>
      );
    }
    return (
      <div>
        <p>{pkg.name}</p>
        <div>
          Dependencies:
          {pkg.dependencies.map(dependency => (
            <div><a href="" onClick={e => {
              e.preventDefault();
              history.push(`/package/${dependency.main}`);
            }}>{dependency.main}</a></div>
          ))}
        </div>
        <p>{pkg.description}</p>
      </div>
    );
  }

  onPackageClick = packageName => {
    history.push(`/package/${packageName}`);
    this.setState({ packageName });
  }
}
