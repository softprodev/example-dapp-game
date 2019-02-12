import TokenService from '../services/TokenService.js';
import { Scene } from 'phaser';

const labelStyle = {
    fontSize: '64px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center',
    backgroundColor: '#2DAA58'
};

const labelConfig = {
    x: 600,
    y: 0,
    origin: { x: 0.5, y: 0 },
    padding: 20,
    text: 'Loading....',
    style: labelStyle
};

const whatsHappeningStyle = {
    backgroundColor: '#333333',
    font: '32px Arial',
    fill: 'white',
    wordWrap: { width: 1200 }
}

export default class BootScene extends Scene {
    constructor() {
        super({ key: 'boot', active: true });
    }

    create(config) {
        let game = this;

        this.make.text({
            x: 0,
            y: 1200,
            padding: 20,
            origin: { x: 0, y: 1 },
            text: "Whats Happening?\n\nWe are querying the ethereum network. If this takes a while something might be broken...",
            style: whatsHappeningStyle
        });
        this.make.text(labelConfig);

        web3.eth.getAccounts().then((accounts) => {
            return web3.eth.getBalance(accounts[0]);
        }).then((balance) => {
            return TokenService.currentNetwork().then(function(tokenService ){
                return tokenService.list().then(function(tokens) {
                    if (tokens.length > 0 || balance > 0) {
                        game.scene.start('crew', {tokenService: tokenService, tokens: tokens});
                    } else {
                        game.scene.start('need-eth', {tokenService: tokenService, tokens: tokens});
                    }
                });
            });

        }).catch(console.alert);
    }
};
