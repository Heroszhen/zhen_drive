<?php

namespace App\Controller\API;

use App\Model\S3File;
use App\Services\S3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[Route('/api/s3')]
final class S3Controller extends AbstractController
{
    public function __construct(
        private readonly S3Service $s3Service
    )
    { }

    #[Route('/get-folder', name: 'app_s3_get_folder', methods:['POST'])]
    public function index(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $response = $this->s3Service->getFolder($content['path']);

        return $this->json($response);
    }

    #[Route('/add-folder', name: 'app_s3_add_folder', methods:['POST'])]
    public function addFolder(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $response = $this->s3Service->addFolder($content['path']);

        return $this->json($response);
    }

    #[Route('/delete-drive', name: 'app_s3_delete_drive', methods:['POST'])]
    public function deleteDrive(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $response = $this->s3Service->deleteDrive($content['path']);

        return $this->json(null, true === $response ? Response::HTTP_NO_CONTENT : Response::HTTP_BAD_REQUEST);
    }

    #[Route('/upload-folder-files', name: 'app_s3_upload_folder_files', methods:['POST'])]
    public function uploadFolderOrFiles(Request $request): Response
    {   
        $files = $request->files;
        $form =  $request->request;

        $rootPath = $form->get('rootPath');
        $rootPath = !str_ends_with($rootPath, '/') ? $rootPath.'/' : $rootPath;

        $driveFiles = [];
        $newFolder = [];
        $total = (int) $form->get('total');
        for ($index = 0; $index < $total; $index++) {
             /** @var UploadedFile $file */
            $file = $files->get("file_{$index}");
            $folderPath = $rootPath;
            if ($form->get("file_{$index}_folder")) {
                $folderPath .= $form->get("file_{$index}_folder");
                $folderPath = !str_ends_with($folderPath, '/') ? $folderPath.'/' : $folderPath;

                $tab = explode('/', $form->get("file_{$index}_folder"));
                $newFolder[] = $tab[0];
            }
            $result = $this->s3Service->sendFile($file, $folderPath);
            $driveFiles[] = $result;
        }

        foreach (array_unique($newFolder) as $folder) {
            $name = rtrim($folder, '/');
            $s3file = new S3File($name, $rootPath.$name.'/');
            $driveFiles[] = $s3file;
        }

        return $this->json($driveFiles, 201);
    }

    #[Route('/get-bucket', name: 'app_s3_get_bucket', methods:['POST'])]
    public function getBucketInfo(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $result = $this->s3Service->getBucket($content['path']);
    
        return $this->json($result);
    }

    #[Route('/get-file-url', name: 'app_s3_get_file-url', methods:['POST'])]
    public function getFileUrl(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $result = $this->s3Service->getFileUrl($content['path']);
    
        return $this->json($result);
    }
}
