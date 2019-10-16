-- Database: Reservation

-- DROP DATABASE "Reservation";

CREATE DATABASE "Reservation"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "Reservation"
    IS 'Database for Reservation project';
	


-- Table: public."Address_Data"

-- DROP TABLE public."Address_Data";

CREATE TABLE public."Address_Data"
(
    "AddressId" numeric(4,0) NOT NULL,
    "StreetAddress" character varying COLLATE pg_catalog."default",
    "Latitude" numeric,
    "Longitude" numeric,
    "Status" character(1),
    CONSTRAINT "Address_Data_pkey" PRIMARY KEY ("AddressId")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Address_Data"
    OWNER to postgres;
COMMENT ON TABLE public."Address_Data"
    IS 'Addresses with Latitude Longitude';

-- Index: Address_idx1

-- DROP INDEX public."Address_idx1";

CREATE UNIQUE INDEX "Address_idx1"
    ON public."Address_Data" USING btree
    ("StreetAddress" COLLATE pg_catalog."default")
    INCLUDE("StreetAddress")
    TABLESPACE pg_default;

COMMENT ON INDEX public."Address_idx1"
    IS 'Speed access to addresses';



-- SEQUENCE: public."Census_Data_PersonId_seq"

-- DROP SEQUENCE public."Census_Data_PersonId_seq";

CREATE SEQUENCE public."Census_Data_PersonId_seq"
    INCREMENT 1
    START 10091
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Census_Data_PersonId_seq"
    OWNER TO postgres;



-- Table: public."Census_Data"

-- DROP TABLE public."Census_Data";

CREATE TABLE public."Census_Data"
(
    "PersonId" integer NOT NULL DEFAULT nextval('"Census_Data_PersonId_seq"'::regclass),
    "AddressId" numeric NOT NULL,
    "Year" integer NOT NULL,
    "LastName" character varying COLLATE pg_catalog."default",
    "GivenName" character varying COLLATE pg_catalog."default",
    "Relation" character varying COLLATE pg_catalog."default",
    "Race" character varying COLLATE pg_catalog."default",
    "Gender" character(1) COLLATE pg_catalog."default",
    "Age" character varying COLLATE pg_catalog."default",
    "Occupation" character varying COLLATE pg_catalog."default",
    "OwnRent" character varying COLLATE pg_catalog."default",
    "PropStat" character varying COLLATE pg_catalog."default",
    "HouseType" character varying COLLATE pg_catalog."default",
    "Notes" text COLLATE pg_catalog."default",
    "SrcFileName" character varying COLLATE pg_catalog."default",
    "LineItem" numeric,
    CONSTRAINT "Census_Data_pk" PRIMARY KEY ("PersonId", "AddressId", "Year")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Census_Data"
    OWNER to postgres;
COMMENT ON TABLE public."Census_Data"
    IS 'People data from census';

-- Index: Census_data_idx1

-- DROP INDEX public."Census_data_idx1";

CREATE INDEX "Census_data_idx1"
    ON public."Census_Data" USING btree
    ("LastName" COLLATE pg_catalog."default", "GivenName" COLLATE pg_catalog."default")
    INCLUDE("LastName", "GivenName")
    TABLESPACE pg_default;


-- SEQUENCE: public."Metadata_Id_seq"

-- DROP SEQUENCE public."Metadata_Id_seq";

CREATE SEQUENCE public."Metadata_Id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."Metadata_Id_seq"
    OWNER TO postgres;



-- Table: public."Metadata"

-- DROP TABLE public."Metadata";

CREATE TABLE public."Metadata"
(
    "Id" integer NOT NULL DEFAULT nextval('"Metadata_Id_seq"'::regclass),
    "Table" character varying COLLATE pg_catalog."default",
    "Column" character varying COLLATE pg_catalog."default",
    "SourceNote" text COLLATE pg_catalog."default",
    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("Id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public."Metadata"
    OWNER to postgres;
COMMENT ON TABLE public."Metadata"
    IS 'Source of the information';