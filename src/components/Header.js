import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../style/header.scss';

class Header extends Component {
    constructor(props) {
        super(props);

        this.links = {
            home: React.createRef(),
            favorites: React.createRef()
        };
    }

    handleClick = ({ target }) => {
        Object.values(this.links).forEach(({ current }) => {
            current.classList.remove('active');
        });

        target.classList.add('active');
    };

    render() {
        const { home, favorites } = this.links;

        return (
            <div>
                <div className="navbar">
                    <p>Herolo Weather Test</p>
                    <div className="right">
                        <Link to="/" className="item active" ref={home} onClick={this.handleClick}>
                            Home
                        </Link>
                        <Link to="/favorites" className="item" ref={favorites} onClick={this.handleClick}>
                            Favorites
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;