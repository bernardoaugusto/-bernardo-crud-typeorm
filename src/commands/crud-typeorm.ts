import { GluegunCommand } from 'gluegun';
import {
    generateCamelCase,
    generateCamelCaseArray,
    generateCamelCaseUpperFirst,
    generateCamelCaseUpperFirstArray,
} from '../utils-cli/common';

const command: GluegunCommand = {
    name: 'crud-typeorm',
    description: 'Create CRUD',
    run: async toolbox => {
        const { print, parameters, template } = toolbox;

        const tableName = parameters.first;
        if (!tableName) {
            print.error('Table name must be specified');
            return;
        }
        const nameCamelCase = generateCamelCase(tableName);
        const nameCamelCaseUpperFirst = generateCamelCaseUpperFirst(nameCamelCase);

        const options = parameters.options as Record<string, string>;

        const { strings, numbers } = options;

        if (!strings && !numbers) {
            print.error('parameters must be specified, strings / numbers');
            return;
        }

        const props = {
            strings: strings ? strings.split(',') : [],
            numbers: numbers ? numbers.split(',') : [],
        };

        const properties = {
            original: props,
            camelCase: {
                strings: generateCamelCaseArray(props.strings),
                numbers: generateCamelCaseArray(props.numbers),
            },
            camelCaseUpperFirst: {
                strings: generateCamelCaseUpperFirstArray(props.strings),
                numbers: generateCamelCaseUpperFirstArray(props.numbers),
            },
        };

        // ENTITY
        await template.generate({
            template: 'entity.ts.ejs',
            target: `src/modules/${nameCamelCase}/infra/http/typeorm/entities/${nameCamelCaseUpperFirst}.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                properties,
            },
        });

        // DTOs
        await template.generate({
            template: 'dtos/DTOinterface.ts.ejs',
            target: `src/modules/${nameCamelCase}/dtos/I${nameCamelCaseUpperFirst}DTO.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                properties,
            },
        });
        await template.generate({
            template: 'dtos/DTOcreate.ts.ejs',
            target: `src/modules/${nameCamelCase}/dtos/I${nameCamelCaseUpperFirst}CreateDTO.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                properties,
            },
        });
        await template.generate({
            template: 'dtos/DTOupdate.ts.ejs',
            target: `src/modules/${nameCamelCase}/dtos/I${nameCamelCaseUpperFirst}UpdateDTO.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                properties,
            },
        });
        await template.generate({
            template: 'dtos/DTOrequestGetAll.ts.ejs',
            target: `src/modules/${nameCamelCase}/dtos/I${nameCamelCaseUpperFirst}RequestGetAllDTO.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                properties,
            },
        });

        // Repository DTO
        await template.generate({
            template: 'repositoryDTO.ts.ejs',
            target: `src/modules/${nameCamelCase}/repositories/I${nameCamelCaseUpperFirst}RepositoryDTO.ts`,
            props: {
                tableName,
                nameCamelCaseUpperFirst,
                nameCamelCase,
                properties,
            },
        });

        print.success(`Successfully generated CRUD.`);
    },
};

module.exports = command;
