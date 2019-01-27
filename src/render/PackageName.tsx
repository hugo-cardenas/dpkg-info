import * as React from 'react'
import history from './history';

interface Props {
  name: string,
  isLink?: boolean
};

export default class PackageName extends React.Component<Props> {
  render() {
    const { isLink, name } = this.props;
    if (isLink) {
      return (
        <a href={`/package/${name}`} onClick={this.onClick}>{name}</a>
      );
    } else {
      return (
        <span>{name}</span>
      );
    }
  }

  onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    history.push(`/package/${this.props.name}`);
  }
}
