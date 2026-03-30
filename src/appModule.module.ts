import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { ENVIRONMENTS } from "./constants";
import modules from './modules';

const sequelizeInitializer = (configService: ConfigService) => {
    return [ENVIRONMENTS.LOCALHOST, ENVIRONMENTS.NONPROD].includes(configService.get<string>('ENVIRONMENT') ?? '')
        ? {
            host: configService.get<string>('DB_HOST'),
            password: configService.get<string>('DB_PASSWORD'),
            username: configService.get<string>('DB_USER'),
            database: configService.get<string>('DB_NAME')
        }
        : {
            host: configService.get<string>('DB_HOST'),
            username: configService.get<string>('DB_USER'), // שמתי לב שפה היה כתוב user במקום username, תיקנתי על הדרך
            database: configService.get<string>('DB_NAME')
        }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SequelizeModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                
                // ----- מצלמת האבטחה שלנו -----
                console.log('!!! DB CONNECTION TEST !!!');
                console.log('ENVIRONMENT IS:', configService.get('ENVIRONMENT'));
                console.log('HOST IS:', configService.get('DB_HOST'));
                console.log('PORT IS:', configService.get('DB_PORT'));
                console.log('DB NAME IS:', configService.get('DB_NAME'));
                // -----------------------------

                // פה הוספנו את ה-return
                return {
                    dialect: 'postgres',
                    ...sequelizeInitializer(configService),
                    port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
                    timezone: 'Asia/Jerusalem',
                    autoLoadModels: true,
                    synchronize: false,
                    logging: false,
                };
            }
        }),
        ...modules
    ]
})

export class AppModule { }