import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable({
})
export class AppService {
    constructor(private httpService: HttpService) { }

    async getAppConfig(configurationName: string, headers: any) {
        return await lastValueFrom<any>(
          this.httpService.get(`${process.env.APP_REGISTRY_URL}/elements/${configurationName}`, { headers })
        );
    }
}
