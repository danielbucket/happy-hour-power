import React from 'react';
import { shallow, mount } from 'enzyme';

import RenderList from '../../components/RenderList';

describe('RenderList', () => {
  it('should render a ', () => {
    const wrapper = shallow(<RenderList />);
    const h2 = wrapper.find('h2');

    expect(wrapper.find('.list').length).toBe(1);
    expect(h2.length).toBe(1);
    expect(h2.node.props.className).toEqual('location-header');
    expect(h2.node.props.children).toEqual('Happy Hour Locations Near You');
  });
});
