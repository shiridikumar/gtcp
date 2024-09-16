# GTCP is graph transactional coverage pattern mining algorithm which esentially computes the coverage patterns for graph transactional data with applications in Drug discovery 
# **Importing this algorithm into a python program**
# --------------------------------------------------------

#       from PAMI.GraphTransactionalCoveragePattern.basic.GTCP import GTCP
#
#       fname="Toydata.txt"
#
#       obj=GTCP(fname,0.1,0.1,0.3,0.2)
#
#       obj.mine()  
#
#       obj.getPatterns()
#
#       memUSS = obj.getMemoryUSS()
#
#       obj.save(oFile)
#
#       print("Total Memory in USS:", memUSS)
#
#       memRSS = obj.getMemoryRSS()
#
#       print("Total Memory in RSS", memRSS)
#
#       run = obj.getRuntime()
#
#       print("Total ExecutionTime in seconds:", run)



from bitarray import bitarray
from PAMI.subgraphMining.basic import gspan as gsp
from PAMI.extras.stats import graphDatabase as gdb
from PAMI.GraphTransactionalCoveragePattern.basic import abstract as _ab

class GTCP:
    def __init__(self,iFile,minGTC,minGTPC,maxOR=0.2):
        """
            iFile : input file
            minsup : Minimum support 
            minGTC : Minimum Graph transaction coverage
            minGTPC : Minimum graph pattern coverage 
            maxOR : Maximum overlap ratio
            Sf : subgraphsBygraphID
            Df: Flat transactional Dataset
        """

        self.Df=[]
        self.Sf=[]
        self.L={}
        self.iFile=iFile
        self.maxOR=maxOR
        self.minGTC=minGTC 
        self.minGTPC=minGTPC
        # gdb_obj=gdb.graphDatabase(self.iFile)
        self.numGraphs=0
        # gsp_obj = gsp.GSpan(self.iFile, minsup, outputSingleVertices=False, maxNumberOfEdges=float('inf'), outputGraphIds=True)
        # gsp_obj.mine()
        # self.Sf=gsp_obj.getSubgraphGraphMapping()
        self.GetFIDBasedFlatTransactions()
        print("Subgraph mining completed")

    def mine(self):
        """
            Mine the coverage patterns
        """
        self._startTime = _ab._time.time()
        self.Cmine()
    

    def getPatterns(self):
        """
            Get all the coverage patterns
        """
        return self.L

    def Coverage(self,g):
        """
            Get coverage of a graph
            param
                g : Graph id
        """
        # print(self.Df[g].count())
        return self.Df[g].count()/self.numFreq


    def patternCoverage(self,pattern):
        """
            Get patternCoverage of a pattern
            param
                pattern: pattern for which pattern coverage needs to be computed
        """
        Csets=list(map(lambda x:self.Df[x] ,pattern))
        newset=bitarray(self.numFreq)
        for coverage in Csets:
            newset=newset | coverage
        return newset

    def OverlapRatio(self,pattern):
        """
            Get Overlap ratio of a pattern
            param
                pattern: pattern for which overlap ratio needs to be computed
        """

        lastitem=pattern[-1]
        lastbut=pattern[:-1]
        lastbutcoverage=self.patternCoverage(lastbut)
        lastcoverage=self.Df[lastitem]
        
        intersection=lastcoverage & lastbutcoverage
        cs= (lastcoverage | lastbutcoverage).count()/self.numFreq
        return (intersection.count()/self.Df[lastitem].count(),cs)


    def GetFIDBasedFlatTransactions(self):
        """
            Convert into FID based transactions
        """
        
        f=open(self.iFile,"r+")
        self.Sf=[]
        ind=0
        ma=0
        for i in f.readlines():
            i=i.replace("\n","")
            trans=[int(j) for j in i.split()]
            # self.Sf.append({"FID":ind,"GIDs":trans})
            ma=max(ma,max(trans))
            ind+=1
        

        print(len(self.Sf))
        self.numFreq=ma+1
        
        self.numGraphs=ind
        self.Df={}
        for i in range(self.numGraphs):
            bitset = bitarray(ma+1)
            bitset.setall(0)
            self.Df.update({i:bitset})
        ind=0
        f.close()
        f=open(self.iFile,"r+")
        for i in f.readlines():
            i=i.replace("\n","")
            trans=[int(j) for j in i.split()]
            for j in trans:
                self.Df[ind][j]=1
            
            ind+=1
        

        
        # for fragment in self.Sf:
        #     for GID in fragment["GIDs"]:
        #         self.Df[GID][fragment["FID"]]=1
        
        print(len(self.Df))

        # print(self.Df)

    def getallFreq1(self):
        """
            Get all the Patterns of size 1

        """
        freq=[(graph,self.Coverage(graph)) for graph in self.Df if self.Coverage(graph)>=self.minGTC]

        sorted_list = sorted(freq, key=lambda x: x[1], reverse=True)
        final_list=list(map(lambda x: [x[0]],sorted_list))
        return final_list

    def join(self,l1,l2):
        """
            Join two patterns
            Param 
                l1: Pattern 1
                l2: Pattern 2
        """
        patterns=[]
        Nol=[]
        temp_l=[]
        newpattern=[]
        print(len(l1))
        for i in range(len(l1)):
            for j in range(i+1,len(l2)):
                if(l1[i][:-1]==l2[j][:-1]):
                    if(self.Coverage(l1[i][-1])>=self.Coverage(l2[j][-1])):
                        newpattern= l1[i]+[l2[j][-1]]
                    else:
                        newpattern=l2[j]+[l1[i][-1]]
                    
                    ov,cs=self.OverlapRatio(newpattern)
                    
                    if(ov<=self.maxOR):
                        if(cs>=self.minGTPC):
                            self.L.append((newpattern,cs))
                        else:
                            self.Nol.append(newpattern)
                else:
                    break
        # return (Nol,temp_l)    
    

    def writePatterns(self):
        outf=self.iFile.split(".")[0]+"_results.txt"
        f=open(outf,"w+")
        for i in self.L:
            f.write(str(i[0])+", Coverage : "+str(i[1]))
            f.write("\n")
        
        f.close()
    
    def Cmine(self):
        """
        Cmine Algorithm for mining coverage patterns
        """

        self.Nol_1=self.getallFreq1()
        # print(self.numFreq,"******************",len(self.Nol_1))
        l=1
        self.L=[]
        self.Nol_1_temp=[]
        for g in self.Nol_1:
            if(self.Coverage(g[0])>=self.minGTPC):

                self.L.append((g,self.Coverage(g[0])))
            else:
                self.Nol_1_temp.append(g)
        l+=1
        print(len(self.Nol_1),len(self.Nol_1_temp),"??????????????????/")
        self.Nol_1=self.Nol_1_temp
        self.Nol=[]



        while(len(self.Nol_1)>0):
            self.Nol=[]
            # print(len(self.Nol_1))
            self.join(self.Nol_1,self.Nol_1)
            self.Nol_1=self.Nol
            l+=1

        process = _ab._psutil.Process(_ab._os.getpid())
        self._endTime = _ab._time.time()
        self._memoryUSS = float()
        self._memoryRSS = float()
        self._memoryUSS = process.memory_full_info().uss
        self._memoryRSS = process.memory_info().rss

        self.L=sorted(self.L, key=lambda x: (x[1],len(x[0])), reverse=True)
    
    def getMemoryUSS(self):
        """
        Total amount of USS memory consumed by the mining process will be retrieved from this function

        :return: returning USS memory consumed by the mining process
        :rtype: float
        """

        return self._memoryUSS

    def getMemoryRSS(self):
        """
        Total amount of RSS memory consumed by the mining process will be retrieved from this function

        :return: returning RSS memory consumed by the mining process
        :rtype: float
        """
        return self._memoryRSS

    def getRuntime(self):
        """
        Calculating the total amount of runtime taken by the mining process

        :return: returning total amount of runtime taken by the mining process
        :rtype: float
        """
        return self._endTime-self._startTime


