import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { TronWeb } from 'tronweb';

@Injectable()
export class WalletService {
  private mnemonic: ethers.Mnemonic;

  constructor(private configService: ConfigService) {
    const phrase = this.configService.get<string>('WALLET_MNEMONIC');
    if (!phrase) {
      throw new Error('🚨 FATAL: WALLET_MNEMONIC is not set in .env. Server cannot start without it.');
    }
    this.mnemonic = ethers.Mnemonic.fromPhrase(phrase);
  }

  // Generate an address derived by index
  public generateAddress(network: 'BSC' | 'TRON', index: number) {
    let derivationPath: string;
    
    if (network === 'BSC') {
      derivationPath = `m/44'/60'/0'/0/${index}`;
      const wallet = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, derivationPath);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        path: derivationPath,
      };
    } else if (network === 'TRON') {
      derivationPath = `m/44'/195'/0'/0/${index}`;
      const wallet = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, derivationPath);
      
      const privateKeyHex = wallet.privateKey.replace('0x', '');
      const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });
      const address = tronWeb.address.fromPrivateKey(privateKeyHex) as string;
      
      return {
        address,
        privateKey: wallet.privateKey,
        path: derivationPath,
      };
    }
    
    throw new InternalServerErrorException('Unsupported network');
  }

  // Generate a Payout Address for a specific merchant
  // Using Account index 1' (0' is used for deposits)
  public generatePayoutWallet(network: 'BSC' | 'TRON', merchantId: number) {
    let derivationPath: string;
    
    if (network === 'BSC') {
      derivationPath = `m/44'/60'/1'/0/${merchantId}`;
      const wallet = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, derivationPath);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        path: derivationPath,
      };
    } else if (network === 'TRON') {
      derivationPath = `m/44'/195'/1'/0/${merchantId}`;
      const wallet = ethers.HDNodeWallet.fromMnemonic(this.mnemonic, derivationPath);
      
      const privateKeyHex = wallet.privateKey.replace('0x', '');
      const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });
      const address = tronWeb.address.fromPrivateKey(privateKeyHex) as string;
      
      return {
        address,
        privateKey: wallet.privateKey,
        path: derivationPath,
      };
    }
    
    throw new InternalServerErrorException('Unsupported network');
  }
}
