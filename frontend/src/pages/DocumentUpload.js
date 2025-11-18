import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Upload, CheckCircle, FileText, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DocumentUpload = () => {
  const { getAuthHeaders } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const requiredDocs = [
    { type: 'Aadhaar Card', description: 'Upload your Aadhaar card' },
    { type: '10th Marksheet', description: 'Upload 10th standard marksheet' },
    { type: '12th Marksheet', description: 'Upload 12th standard marksheet' },
    { type: 'Photograph', description: 'Upload passport size photo' },
    { type: 'Category Certificate', description: 'If applicable' },
    { type: 'Income Certificate', description: 'If applicable' },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents/list`, getAuthHeaders());
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;
    
    setLoading(true);
    
    // Simulate file upload (in production, you'd upload to storage service)
    const fakeUrl = `https://storage.example.com/${Date.now()}-${file.name}`;
    
    try {
      await axios.post(
        `${API}/documents/upload`,
        {
          document_type: docType,
          document_url: fakeUrl,
          status: 'Uploaded'
        },
        getAuthHeaders()
      );
      
      toast.success(`${docType} uploaded successfully!`);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (docType) => {
    return documents.find(doc => doc.document_type === docType);
  };

  const getStatusColor = (status) => {
    if (status === 'Uploaded') return 'text-green-600 bg-green-100';
    if (status === 'Rejected') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
        <p className="text-gray-600">Upload all required documents for verification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredDocs.map((doc, index) => {
          const uploadedDoc = getDocumentStatus(doc.type);
          const isUploaded = !!uploadedDoc;
          
          return (
            <Card key={index} data-testid={`doc-card-${index}`} className="border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base mb-1">{doc.type}</CardTitle>
                      <p className="text-xs text-gray-600">{doc.description}</p>
                    </div>
                  </div>
                  {isUploaded && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                </div>
              </CardHeader>
              <CardContent>
                {isUploaded ? (
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(uploadedDoc.status)}`}>
                      {uploadedDoc.status}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`reupload-btn-${index}`}
                      className="w-full mt-2"
                      onClick={() => document.getElementById(`file-${index}`).click()}
                    >
                      Re-upload
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    data-testid={`upload-btn-${index}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => document.getElementById(`file-${index}`).click()}
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
                
                <input
                  id={`file-${index}`}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(doc.type, e.target.files[0])}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-5">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Please ensure all documents are clear and readable. Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;