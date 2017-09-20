import React from 'react';
import { shallow, mount } from 'enzyme';

import RenderMap from '../../components/RenderMap';

describe('RenderList', () => {
  it.only('should render a ', () => {
    const wrapper = shallow(<RenderMap />);
    const returnDiv = wrapper.find('.map-area');

    expect(returnDiv.length).toBe(1);
    expect(returnDiv.node.props.className).toEqual('map-area');
  });
});
