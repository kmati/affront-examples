import { Affront } from 'affront';
import styles from './styles.css';

export class AddressControl extends Affront.Control {
	constructor(id) {
		const template = require('raw!./view-template.html');
		super(id, template, styles);
	}
};