/* tslint:disable */
import { MappingSetting } from "./mapping-setting.model";

export type MappingSettingResponse = {
    count: number;
    next: string;
    previous: string;
    results: MappingSetting[];
};
