import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

import { sampleUser, sampleDjs, sampleDjHost, sampleDjGuest } from '../utils';

import SingleDj from '../../app/components/SingleDj';
import { DjsComponent } from '../../app/components/Djs';



describe('<SingleDj /> dumb component', () => {

	// let onTypeSpy, trackSearchSpy, search;
	let singleDj;

	beforeEach('Create shallow copy with user and dj on props', () => {
		// singleDj = shallow(<DjsList user={sampleUser} dj={sampleDjGuest}/>);
	}); // TODO: this needs to alternate for guest and host

	it('should render one way for guests', () => {
		// console.log('RAN THIS TEST!!!!!!!');
	});

	it('should do more stuff', () => {
		// console.log('ran test')
	});


})

// // // onType={ onTypeSpy } trackSearch={ trackSearchSpy }
