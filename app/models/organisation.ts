class RelLink {
    href: string;
    rel: string;
}

class Role {
    code: string;
    description: string;
    operationalStartDate: string;
    operationalEndDate: string;
    legalStartDate: string;
    legalEndDate: string;
    status: string;
    primaryRole: boolean;    
}

class Relationships {
    code: string;
    description: string;    
    operationalStartDate: string;
    operationalEndDate: string;
    legalStartDate: string;
    legalEndDate: string;
    status: string;
    relatedOdsCode: string;
    relatedOrganisationName: string;
    uniqueId: number;   
    links: RelLink[]; 
}

export class Successor {
    links: RelLink[];
    targetOdsCode: string;
    targetprimaryrolecode: string;
    type: string; 
    uniqueId: number;
    name: string;
}

export class Address {
    addressLines: string[];
    town: string;
    county: string;
    postalCode: string;
    country: string;
}

export class Organisation { 
    name: string;
    addresses: Address[];
    status: string;
    last_changed: string;
    operationalStartDate: string;
    operationalEndDate: string;
    odsCode: string;
    legalStartDate: string;
    legalEndDate: string;
    roles: Role[];    
    successors: Successor[];
    relationships: Relationships[];    
}