import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly appConfigMap = {
    'mnc-dmepos': this.configService.get('DMEPOS_URL'),
    'mnc-notes': this.configService.get('NOTES_URL'),
    'mnc-document': this.configService.get('DOCUMENTS_URL'),
  }

  constructor(private configService: ConfigService) {
  }

  @Get()
  ping(): string {
    return 'pong';
  }

  @Get('/elements/:config')
  async elements(@Param('config') name: string = '', @Res() res: Response) {
    const applicationKey = Object.keys(this.appConfigMap).find((key) => name.toLowerCase().includes(key));
    const source = this.appConfigMap[applicationKey];

    if (!applicationKey || !source) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ status: HttpStatus.NOT_FOUND, message: 'Configuration was not found' });
    }

    const config = {
      appElementName: applicationKey,
      fqan: applicationKey,
      scriptUrls: [
        'polyfills.js',
        'vendor.js',
        'runtime.js',
        'main.js'
      ],
      styleUrls: [
        'styles.css'
      ],
      widgets: []
    }

    config.scriptUrls = config.scriptUrls.map((url) => url.replace('{{url}}', source));
    config.styleUrls = config.styleUrls.map((url) => url.replace('{{url}}', source));

    return res.status(HttpStatus.OK).json({
      ...config,
      scriptUrls: config.scriptUrls.map((url) => `${source}/${url}`),
      styleUrls: config.styleUrls.map((url) => `${source}/${url}`)
    });
  }

  @Get('/applications/element-names')
  elementNames(): string[] {
    return ['mnc-dmepos'];
  }
}
