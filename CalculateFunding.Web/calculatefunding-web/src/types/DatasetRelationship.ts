import { DatasetRelationshipType } from "./Datasets/DatasetRelationshipType";

export interface DatasetDefinition {
  description: string;
  id: string;
  name: string;
  isLatestVersion :boolean;
  lastUpdatedBy : string;
  lastUpdatedDt : string;
  version : number;
}

export interface DatasetRelationship {
  definition: DatasetDefinition;
  relationshipDescription: string;
  relationshipType: DatasetRelationshipType;
  converterEligible: boolean;
  converterEnabled: boolean;
  isProviderData: boolean;
  id: string;
  name: string;
  fundingPeriodName: string;
}
