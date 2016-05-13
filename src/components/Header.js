require('normalize.css');
require('styles/App.css');

import React, {
  Component
} from 'react';

import { connect } from 'react-redux';
import { get, sumBy } from 'lodash';
import { dataFilter } from '../helpers/dataHelpers';
import numbro from 'numbro';

class Header extends Component {
  render() {
    let {
      country,
      product,
      variable,
      year,
      value
    } = this.props;

    let verbs = {
      'import_value': 'imported',
      'export_value': 'exported'
    }

    let destination = {
      'import_value': 'from',
      'export_value': 'to'
    }

    let header = `In ${year}, what was trade between Africa and China?`

    if(country && product) {
      header = `${country} ${get(verbs, variable)} ${numbro(value).format('$ 0.00 a')} of ${product} ${get(destination, variable)} China`;
    } else if(country && !product) {
      header = `${country} ${get(verbs, variable)} ${numbro(value).format('$ 0.00 a')} ${get(destination, variable)} China`;
    } else if(!country && product) {
      header = `Africa ${get(verbs, variable)} ${numbro(value).format('$ 0.00 a')} ${get(destination, variable)} of ${product} ${get(destination, variable)} China`;
    }

   return (
     <div>
       <h1 className='question'>
        {header}
       </h1>
     </div>
    );
  }
}



function mapStateToProps(state, props){
  let {
    tradeData
  } = state.dataReducer

  let {
    country,
    product,
    variable,
    year
  } = props.location.query;


  let data = dataFilter(country, product, year, tradeData);

  variable =  variable === 'import_value' ? 'import_value' : 'export_value';

  year = ! year ? 2014 : year;

  let value = sumBy(data, (d) => { return get(d, variable);});

  return {
    country,
    product,
    variable,
    year,
    value
  };
}

export default connect(mapStateToProps)(Header);
