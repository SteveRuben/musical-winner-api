import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    NotFoundException,
    Put
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';


@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) { }

    @Post()
    async createTemplate(
        @Body() createTemplateDto: CreateTemplateDto,
    ) {
        const template = await this.templatesService.createTemplate(
            createTemplateDto.name,
            createTemplateDto.data,
            createTemplateDto.creatorId
        );
        return { template };
    }

    @Get(':name')
    async getTemplate(@Param('name') name: string) {
        const template = await this.templatesService.getTemplate(name);
        if (!template) {
            throw new NotFoundException('No template exists with that name');
        }
        return { template };
    }

    @Put(':name')
    async updateTemplate(
        @Param('name') name: string,
        @Body() updateTemplateDto: UpdateTemplateDto,
    ) {
        const template = await this.templatesService.updateTemplate(
            name,
            updateTemplateDto.data,
        );
        return { template };
    }
}