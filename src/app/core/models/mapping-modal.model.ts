/* tslint:disable */
import { MappingRow } from "./mapping-row.model";
import { MappingSetting } from "./mapping-setting.model";

export type MappingModal = {
  workspaceId: number;
  rowElement?: MappingRow;
  setting?: MappingSetting;
};
