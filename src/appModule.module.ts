import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ENVIRONMENTS } from "./constants";
import modules from './modules';

const sequelizeInitializer = (configService: ConfigService) => {
    return ENVIRONMENTS.NONPROD === configService.get<string>('ENVIRONMENT')
        ? {
            host: configService.get<string>('DB_HOST'),
            password: configService.get<string>('DB_PASSWORD'),
            username: configService.get<string>('DB_USER'),
            database: configService.get<string>('DB_NAME')
        }
        : {
            host: configService.get<string>('DB_HOST'),
            username: configService.get<string>('DB_USER'),
            database: configService.get<string>('DB_NAME')
        }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                ...sequelizeInitializer(configService),
                port: parseInt(configService.get<string>('DB_PORT')!, 5432),
                schema: 'shoval',
                timezone: 'Asia/Jerusalem',
                autoLoadModels: true,
                synchronize: false,
                logging: false,
            })
        }),
        ...modules
    ]
})

export class AppModule { }