/* tslint:disable */
import { MappingDestination } from "./mapping-destination.model";
import { MappingSource } from "./mapping-source.model";

export type MappingRow = {
    source: MappingSource;
    destination: MappingDestination;
};
