IF  EXISTS (SELECT * FROM sys.schemas WHERE name = N'waqs')
DROP SCHEMA [waqs]
GO

CREATE SCHEMA [waqs] AUTHORIZATION [dbo]
GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[waqs].[Task]') AND type in (N'U'))
DROP TABLE [waqs].[Task]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO

CREATE TABLE [waqs].[Task](
	[id] [int] NOT NULL IDENTITY (1,1),
	[uuid] [varchar] (50) NOT NULL,
	[description] [varchar] (100) NOT NULL,
	[createdDate] [datetime] NOT NULL CONSTRAINT [DF_Deal_createdDate] DEFAULT (getdate()),
	[createdById] [varchar] (50) NULL DEFAULT ''
)
GO

ALTER TABLE [waqs].[Task] ADD CONSTRAINT [AK_Task] PRIMARY KEY
	CLUSTERED
	(
		[uuid] DESC
	)	WITH
	(
		STATISTICS_NORECOMPUTE = OFF
		,IGNORE_DUP_KEY = OFF
	)
GO

INSERT [waqs].[Task]
       ([uuid], [description])
VALUES (NEWID(), 'Buy Bananas')
GO
INSERT [waqs].[Task]
       ([uuid], [description])
VALUES (NEWID(), 'Eat Fiber')
GO
INSERT [waqs].[Task]
       ([uuid], [description])
VALUES (NEWID(), 'Run 5 Miles')
GO

SELECT *
FROM   [waqs].[Task]
