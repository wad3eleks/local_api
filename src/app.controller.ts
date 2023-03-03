import { Controller, Get, HttpStatus, Param, Res, Response } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import { join } from 'path';

const envApplicationConfigMap = {
  'mnc-dmepos': 'DMEPOS_URL',
  'mnc-notes': 'NOTES_URL',
};

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get()
  ping(): string {
    return 'pong';
  }

  @Get('/elements/:config')
  async elements(@Param('config') name: string, @Res() res: Response) {
    const file: any = await fs.readFile(join(process.cwd(), `elements/${name.toLowerCase()}`), 'utf-8');
    const config = JSON.parse(file);
    const source = this.configService.get<string>(envApplicationConfigMap[config.appElementName]);

    config.scriptUrls = config.scriptUrls.map((url) => url.replace('{{url}}', source));
    config.styleUrls = config.styleUrls.map((url) => url.replace('{{url}}', source));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.status(HttpStatus.OK).json(config);
  }

  @Get('/applications/element-names')
  elementNames(): string[] {
    return ['mnc-dmepos'];
  }
}
